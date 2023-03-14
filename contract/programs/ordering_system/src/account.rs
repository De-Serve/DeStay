use anchor_lang::prelude::*;

use crate::constants::*;
// account to save config
#[account]
pub struct Config {
  pub royalties: [Royalty; MAX_ROYALTY_COUNT as usize], // save wallet and percent to distribute profit
  pub count: u32
}

// account to save order
#[account]
pub struct Order {
  pub order_id: u64, // unique order id
  pub amount: u64, // sol payment for order
  pub user: Pubkey, // user to create order
  pub status: u32 // 0: created, 1: rejected, 2: accepted, 3: achieved, 4, canceled: 5, forced: 6
}

#[derive(Copy, Clone, AnchorSerialize, AnchorDeserialize, Default)]
pub struct Royalty {
  pub wallet: Pubkey,
  pub percent: u64
}
