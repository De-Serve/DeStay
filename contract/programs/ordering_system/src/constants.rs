use anchor_lang::prelude::Pubkey;

pub const CONFIG_SEED: &str = "config";
pub const ORDER_SEED: &str = "order";
pub const POOL_SEED: &str = "pool";

pub const ADMIN_KEY: Pubkey = anchor_lang::solana_program::pubkey!("3ttYrBAp5D2sTG2gaBjg8EtrZecqBQSBuFRhsqHWPYxX"); 
pub const DECIMAL: u64 = 1000000000;
pub const MAX_ROYALTY_COUNT: u8 = 10;
pub const PERCENT_DECIMAL: u64 = 1000;

pub const CREATED_ORDER: u32 = 1;
pub const REJECTED_ORDER: u32 = 2;
pub const ACCEPTED_ORDER: u32 = 3;
pub const ACHIEVED_ORDER: u32 = 4;
pub const CANCELED_ORDER: u32 = 5;
pub const FORCED_ORDER: u32 = 6;
