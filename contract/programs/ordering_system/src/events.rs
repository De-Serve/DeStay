//! Crate events

use anchor_lang::prelude::*;

#[event]
pub struct OrderCreated {
  pub order_id: u64,
  pub user: Pubkey,
  pub amount: u64,
  pub timestamp: u32
}

#[event]
pub struct OrderUpdated {
  pub order_id: u64,
  pub user: Pubkey,
  pub amount: u64,
  pub timestamp: u32
}

#[event]
pub struct OrderCanceled {
  pub order_id: u64,
  pub user: Pubkey,
  pub amount: u64,
  pub timestamp: u32
}

#[event]
pub struct OrderRejected {
  pub order_id: u64,
  pub user: Pubkey,
  pub amount: u64,
  pub timestamp: u32
}

#[event]
pub struct OrderAccepted {
  pub order_id: u64,
  pub user: Pubkey,
  pub amount: u64,
  pub timestamp: u32
}

#[event]
pub struct OrderAchieved {
  pub order_id: u64,
  pub user: Pubkey,
  pub amount: u64,
  pub timestamp: u32
}

#[event]
pub struct OrderForced {
  pub order_id: u64,
  pub user: Pubkey,
  pub amount: u64,
  pub timestamp: u32
}