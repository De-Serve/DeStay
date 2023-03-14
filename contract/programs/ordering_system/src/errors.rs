use anchor_lang::prelude::*;

#[error_code]
pub enum OrderError {
    #[msg("Order is unable to update")]
    OrderOutUpdate,
    #[msg("No need to update")]
    NoNeedUpdate,
    #[msg("Invalid Royalty Account")]
    InvalidRoyaltyAccount,
    #[msg("Invalid Royalty")]
    InvalidRoyalty
}