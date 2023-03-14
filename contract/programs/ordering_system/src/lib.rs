use anchor_lang::prelude::*;
use anchor_lang::solana_program::{pubkey::Pubkey, system_instruction, program::{invoke}};

declare_id!("3JFgCsPEVh7RUy4PP1kN6ittyXuXNsxRWcY25BmncgAn");

pub mod contexts;
pub mod utils;
pub mod constants;
pub mod events;
pub mod account;
pub mod errors;

use contexts::*;
use account::*;
use utils::*;
use errors::*;
use constants::*;
use events::*;

#[program]
pub mod ordering_system {
    use super::*;

    pub fn initialize(ctx: Context<InitializeContext>, royalites: Vec<Royalty>) -> Result<()> {
        let a_config = &mut ctx.accounts.config;
        let mut count = 0;
        let mut sum = 0;
        for royalty in royalites.iter() {
            a_config.royalties[count] = *royalty;
            sum += royalty.percent;
            count += 1;
        }
        require!(sum < 100 * PERCENT_DECIMAL, OrderError::InvalidRoyalty);

        a_config.count = count as u32;

        Ok(())
    }

    pub fn update_config(ctx: Context<UpdateConfigContext>, royalites: Vec<Royalty>) -> Result<()> {
        let a_config = &mut ctx.accounts.config;
        let mut count = 0;
        let mut sum = 0;

        for royalty in royalites.iter() {
            a_config.royalties[count] = *royalty;
            sum += royalty.percent;
            count += 1;
        }
        require!(sum < 100 * PERCENT_DECIMAL, OrderError::InvalidRoyalty);
        a_config.count = count as u32;

        Ok(())
    }

    // demo version
    // deposit sol to escrow
    pub fn deposit(ctx: Context<DepositContext>, amount: u64) -> Result<()> {
        let a_pool = ctx.accounts.pool.to_account_info();
        let a_user = ctx.accounts.user.to_account_info();

        invoke(
            &system_instruction::transfer(&a_user.key(), &a_pool.key(), amount),
            &[
                a_user,
                a_pool
            ]
        )?;


        Ok(())
    }

    // withdraw sol from escrow to user
    pub fn withdraw(ctx: Context<DepositContext>, amount: u64) -> Result<()> {
        let a_pool = &mut ctx.accounts.pool.to_account_info();
        let a_user = &mut ctx.accounts.user.to_account_info();

        **a_user.try_borrow_mut_lamports()? += amount;
        **a_pool.try_borrow_mut_lamports()? -= amount;
        
        Ok(())
    }

    // transfer sol back by admin
    pub fn reject(ctx: Context<RejectContext>, amount: u64) -> Result<()> {
        let a_pool = &mut ctx.accounts.pool.to_account_info();
        let a_user = &mut ctx.accounts.user.to_account_info();

        **a_user.try_borrow_mut_lamports()? += amount;
        **a_pool.try_borrow_mut_lamports()? -= amount;
        
        Ok(())
    }

    // finalize ordering and distribute sol to business and platform owners
    pub fn finalize(ctx: Context<FinalizeContext>, amount: u64) -> Result<()> {
        let a_config = &ctx.accounts.config;
        let a_pool = &mut ctx.accounts.pool.to_account_info();

        **a_pool.try_borrow_mut_lamports()? -= amount;
        let mut sum = 0;
        for i in 0..a_config.count {
            let a_royalty = &mut ctx.remaining_accounts[i as usize].to_account_info();
            require!(a_config.royalties[i as usize].wallet == a_royalty.key(), OrderError::InvalidRoyaltyAccount);
            let royalty_amount = amount * a_config.royalties[i as usize].percent / (100 * PERCENT_DECIMAL);
            sum += royalty_amount;
            **a_royalty.try_borrow_mut_lamports()? += royalty_amount;
        }
        
        let a_royalty = &mut ctx.remaining_accounts[a_config.count as usize].to_account_info();

        **a_royalty.try_borrow_mut_lamports()? += amount - sum;

        Ok(())
    }



    // real version
    pub fn create_order(ctx: Context<CreateOrderContext>, order_id: u64, amount: u64) -> Result<()> {
        let a_order = &mut ctx.accounts.order;
        let a_pool = &mut ctx.accounts.pool.to_account_info();
        let a_user = &mut ctx.accounts.user.to_account_info();

        **a_user.try_borrow_mut_lamports()? -= amount;
        **a_pool.try_borrow_mut_lamports()? += amount;

        a_order.order_id = order_id;
        a_order.amount = amount;
        a_order.status = CREATED_ORDER;

        emit!(OrderCreated {
            order_id: order_id,
            user: a_user.key(),
            amount: amount,
            timestamp: get_current_time()?
        });
        Ok(())
    }

    pub fn update_order(ctx: Context<UpdateOrderContext>, new_amount: u64) -> Result<()> {
        let a_order = &mut ctx.accounts.order;
        let a_pool = &mut ctx.accounts.pool.to_account_info();
        let a_user = &mut ctx.accounts.user.to_account_info();

        require!(a_order.status == 0, OrderError::OrderOutUpdate);
        require!(a_order.amount != new_amount, OrderError::NoNeedUpdate);

        if a_order.amount > new_amount  {
            **a_user.try_borrow_mut_lamports()? += a_order.amount.checked_sub(new_amount).unwrap();
            **a_pool.try_borrow_mut_lamports()? -= a_order.amount.checked_sub(new_amount).unwrap();
        }
        else {
            **a_user.try_borrow_mut_lamports()? += new_amount.checked_sub(a_order.amount).unwrap();
            **a_pool.try_borrow_mut_lamports()? -= new_amount.checked_sub(a_order.amount).unwrap();
        }

        emit!(OrderUpdated {
            order_id: a_order.order_id,
            user: a_user.key(),
            amount: new_amount,
            timestamp: get_current_time()?
        });

        Ok(())
    }

    pub fn cancel_order(ctx: Context<CancelOrderContext>) -> Result<()> {
        let a_order = &mut ctx.accounts.order;
        let a_pool = &mut ctx.accounts.pool.to_account_info();
        let a_user = &mut ctx.accounts.user.to_account_info();

        require!(a_order.status == 0, OrderError::OrderOutUpdate);

        **a_user.try_borrow_mut_lamports()? += a_order.amount;
        **a_pool.try_borrow_mut_lamports()? -= a_order.amount;

        a_order.status = CANCELED_ORDER;

        emit!(OrderCanceled {
            order_id: a_order.order_id,
            user: a_user.key(),
            amount: a_order.amount,
            timestamp: get_current_time()?
        });

        Ok(())
    }

    pub fn reject_order(ctx: Context<RejectOrderContext>) -> Result<()> {
        let a_order = &mut ctx.accounts.order;
        let a_pool = &mut ctx.accounts.pool.to_account_info();
        let a_user = &mut ctx.accounts.user.to_account_info();

        require!(a_order.status == 0, OrderError::OrderOutUpdate);

        **a_user.try_borrow_mut_lamports()? += a_order.amount;
        **a_pool.try_borrow_mut_lamports()? -= a_order.amount;

        a_order.status = REJECTED_ORDER;

        emit!(OrderRejected {
            order_id: a_order.order_id,
            user: a_user.key(),
            amount: a_order.amount,
            timestamp: get_current_time()?
        });

        Ok(())
    }

    pub fn accept_order(ctx: Context<AcceptOrderContext>) -> Result<()> {
        let a_order = &mut ctx.accounts.order;

        require!(a_order.status == 0, OrderError::OrderOutUpdate);

        a_order.status = ACCEPTED_ORDER;

        emit!(OrderAccepted {
            order_id: a_order.order_id,
            user: a_order.user,
            amount: a_order.amount,
            timestamp: get_current_time()?
        });

        Ok(())
    }

    pub fn achieved_order(ctx: Context<AchievedOrderContext>) -> Result<()> {
        let a_config = &ctx.accounts.config;
        let a_order = &mut ctx.accounts.order;
        let a_pool = &mut ctx.accounts.pool.to_account_info();

        require!(a_order.status == 0, OrderError::OrderOutUpdate);

        **a_pool.try_borrow_mut_lamports()? -= a_order.amount;
        for i in 0..a_config.count {
            let a_royalty = &mut ctx.remaining_accounts[i as usize].to_account_info();
            require!(a_config.royalties[i as usize].wallet == a_royalty.key(), OrderError::InvalidRoyaltyAccount);
            let amount = a_order.amount * a_config.royalties[i as usize].percent / (100 * PERCENT_DECIMAL);
            **a_royalty.try_borrow_mut_lamports()? += amount;
        }

        a_order.status = ACHIEVED_ORDER;

        emit!(OrderAchieved {
            order_id: a_order.order_id,
            user: a_order.user,
            amount: a_order.amount,
            timestamp: get_current_time()?
        });

        Ok(())
    }

    pub fn force_order(ctx: Context<ForceOrderContext>) -> Result<()> {
        let a_config = &ctx.accounts.config;
        let a_order = &mut ctx.accounts.order;
        let a_pool = &mut ctx.accounts.pool.to_account_info();

        require!(a_order.status == 0, OrderError::OrderOutUpdate);

        **a_pool.try_borrow_mut_lamports()? -= a_order.amount;
        for i in 0..a_config.count {
            let a_royalty = &mut ctx.remaining_accounts[i as usize].to_account_info();
            require!(a_config.royalties[i as usize].wallet == a_royalty.key(), OrderError::InvalidRoyaltyAccount);
            let amount = a_order.amount * a_config.royalties[i as usize].percent / (100 * PERCENT_DECIMAL);
            **a_royalty.try_borrow_mut_lamports()? += amount;
        }

        a_order.status = FORCED_ORDER;

        emit!(OrderForced {
            order_id: a_order.order_id,
            user: a_order.user,
            amount: a_order.amount,
            timestamp: get_current_time()?
        });

        Ok(())
    }

}

