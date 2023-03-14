use anchor_lang::prelude::*;
use std::mem::size_of;

use crate::account::*;
use crate::constants::*;

#[derive(Accounts)]
pub struct InitializeContext<'info> {
  #[account(mut, constraint = admin.key() == ADMIN_KEY)]
  pub admin: Signer<'info>,
  #[account(init, seeds = [CONFIG_SEED.as_bytes()], 
    bump, 
    payer = admin, 
    space = size_of::<Config>() + 8
  )]
  pub config: Account<'info, Config>,
  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateConfigContext<'info> {
  #[account(constraint = admin.key() == ADMIN_KEY)]
  pub admin: Signer<'info>,
  #[account(mut, seeds = [CONFIG_SEED.as_bytes()], 
    bump, 
  )]
  pub config: Account<'info, Config>,
  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(order_id: u64)]
pub struct CreateOrderContext<'info> {
  #[account(mut)]
  pub user: Signer<'info>,
  /// CHECK: it's not dnagerous
  #[account(init, seeds = [
    POOL_SEED.as_bytes(), 
    &order_id.to_le_bytes(), 
    user.key().as_ref()], 
    bump, 
    payer = user, 
    space = 0
  )]
  pub pool: AccountInfo<'info>,
  #[account(init, seeds = [
    ORDER_SEED.as_bytes(), 
    &order_id.to_le_bytes(), 
    user.key().as_ref()], 
    bump, 
    payer = user, 
    space = size_of::<Order>() + 8
  )]
  pub order: Account<'info, Order>,
  pub system_program: Program<'info, System>
}


#[derive(Accounts)]
pub struct UpdateOrderContext<'info> {
  #[account(mut)]
  pub user: Signer<'info>,
  /// CHECK: it's not dnagerous
  #[account(mut, seeds = [
    POOL_SEED.as_bytes(), 
    &order.order_id.to_le_bytes(), 
    user.key().as_ref()], 
    bump, 
  )]
  pub pool: AccountInfo<'info>,
  #[account(mut, seeds = [
    ORDER_SEED.as_bytes(), 
    &order.order_id.to_le_bytes(), 
    user.key().as_ref()], 
    bump, 
    constraint = order.user == user.key()
  )]
  pub order: Account<'info, Order>,
  pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct CancelOrderContext<'info> {
  #[account(mut)]
  pub user: Signer<'info>,
  /// CHECK: it's not dnagerous
  #[account(mut, seeds = [
    POOL_SEED.as_bytes(), 
    &order.order_id.to_le_bytes(), 
    user.key().as_ref()], 
    bump, 
  )]
  pub pool: AccountInfo<'info>,
  #[account(mut, seeds = [
    ORDER_SEED.as_bytes(), 
    &order.order_id.to_le_bytes(), 
    user.key().as_ref()], 
    bump, 
    constraint = order.user == user.key()
  )]
  pub order: Account<'info, Order>,
  pub system_program: Program<'info, System>
}


#[derive(Accounts)]
pub struct RejectOrderContext<'info> {
  #[account(mut, constraint = admin.key() == ADMIN_KEY)]
  pub admin: Signer<'info>,
  /// CHECK: it's not dangerous
  pub user: AccountInfo<'info>,
  /// CHECK: it's not dnagerous
  #[account(mut, seeds = [
    POOL_SEED.as_bytes(), 
    &order.order_id.to_le_bytes(), 
    user.key().as_ref()], 
    bump, 
  )]
  pub pool: AccountInfo<'info>,
  #[account(mut, seeds = [
    ORDER_SEED.as_bytes(), 
    &order.order_id.to_le_bytes(), 
    user.key().as_ref()], 
    bump, 
    constraint = order.user == user.key()
  )]
  pub order: Account<'info, Order>,
  pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct AcceptOrderContext<'info> {
  #[account(mut, constraint = admin.key() == ADMIN_KEY)]
  pub admin: Signer<'info>,
  /// CHECK: it's not dangerous
  pub user: AccountInfo<'info>,
  /// CHECK: it's not dnagerous
  #[account(mut, seeds = [
    POOL_SEED.as_bytes(), 
    &order.order_id.to_le_bytes(), 
    user.key().as_ref()], 
    bump, 
  )]
  pub pool: AccountInfo<'info>,
  #[account(mut, seeds = [
    ORDER_SEED.as_bytes(), 
    &order.order_id.to_le_bytes(), 
    user.key().as_ref()], 
    bump, 
    constraint = order.user == user.key()
  )]
  pub order: Account<'info, Order>,
  pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct AchievedOrderContext<'info> {
  pub config: Account<'info, Config>,
  #[account(mut)]
  pub user: Signer<'info>,
  /// CHECK: it's not dnagerous
  #[account(mut, seeds = [
    POOL_SEED.as_bytes(), 
    &order.order_id.to_le_bytes(), 
    user.key().as_ref()], 
    bump, 
  )]
  pub pool: AccountInfo<'info>,
  #[account(mut, seeds = [
    ORDER_SEED.as_bytes(), 
    &order.order_id.to_le_bytes(), 
    user.key().as_ref()], 
    bump, 
    constraint = order.user == user.key()
  )]
  pub order: Account<'info, Order>,
  pub system_program: Program<'info, System>
}


#[derive(Accounts)]
pub struct ForceOrderContext<'info> {
  pub config: Account<'info, Config>,
  #[account(mut)]
  pub admin: Signer<'info>,
  /// CHECK: it's not dangerous
  pub user: AccountInfo<'info>,
  /// CHECK: it's not dnagerous
  #[account(mut, seeds = [
    POOL_SEED.as_bytes(), 
    &order.order_id.to_le_bytes(), 
    user.key().as_ref()], 
    bump, 
  )]
  pub pool: AccountInfo<'info>,
  #[account(mut, seeds = [
    ORDER_SEED.as_bytes(), 
    &order.order_id.to_le_bytes(), 
    user.key().as_ref()], 
    bump, 
    constraint = order.user == user.key()
  )]
  pub order: Account<'info, Order>,
  pub system_program: Program<'info, System>
}


// demo version

#[derive(Accounts)]
pub struct DepositContext<'info> {
  #[account(mut)]
  pub user: Signer<'info>,
  /// CHECK: it's not dnagerous
  #[account(init_if_needed, seeds = [
    POOL_SEED.as_ref(), 
    user.key().as_ref()], 
    bump, 
    payer = user, 
    space = 0
  )]
  pub pool: AccountInfo<'info>,
  pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct WithdrawContext<'info> {
  #[account(mut)]
  pub user: Signer<'info>,
  /// CHECK: it's not dnagerous
  #[account(mut, seeds = [
    POOL_SEED.as_bytes(), 
    user.key().as_ref()], 
    bump
  )]
  pub pool: AccountInfo<'info>,
  pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct RejectContext<'info> {
  #[account(mut)]
  pub admin: Signer<'info>,
  /// CHECK: it's not dnagerous
  #[account(mut)]
  pub user: AccountInfo<'info>,
  /// /// CHECK: it's not dnagerous
  #[account(mut, seeds = [
    POOL_SEED.as_bytes(), 
    user.key().as_ref()], 
    bump
  )]
  pub pool: AccountInfo<'info>,
  pub system_program: Program<'info, System>
}


#[derive(Accounts)]
pub struct FinalizeContext<'info> {
  pub config: Account<'info, Config>,
  #[account(mut)]
  pub user: Signer<'info>,
  /// CHECK: it's not dnagerous
  #[account(mut, seeds = [
    POOL_SEED.as_bytes(), 
    user.key().as_ref()], 
    bump
  )]
  pub pool: AccountInfo<'info>,
  pub system_program: Program<'info, System>
}

