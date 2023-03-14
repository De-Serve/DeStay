import * as anchor from '@project-serum/anchor'
import { POOL_SEED, PROGRAM_ID, DECIMAL, CONFIG_SEED } from './config';
import {IDL} from '../constants/IDL';

// send transaction to deposit to escrow for booking
export const deposit = async (
  connection: any,
  wallet: any,
  price: number
) => {
  try {
    const provider = new anchor.AnchorProvider(connection, wallet, {
      skipPreflight: true,
      preflightCommitment: 'confirmed',
    })

    const program = new anchor.Program(IDL, PROGRAM_ID, provider);

    const [pool] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(POOL_SEED),
      wallet.publicKey.toBuffer()],
      program.programId
    );
    console.log('pool', pool.toString());
    const builder = program.methods.deposit(new anchor.BN(price * DECIMAL));
    builder.accounts({
      user: wallet.publicKey,
      pool: pool,
      systemProgram: anchor.web3.SystemProgram.programId,
    });

    builder.signers([]);
    const txId = await builder.rpc();
    if (!txId) return false;
    console.log('txId', txId)
    return true;

  }
  catch (error) {
    console.log("error", error)
    return null;
  }
}

// send transaction to withdraw from escrow from booking
export const withdraw = async (
  connection: any,
  wallet: any,
  price: number
) => {
  try {
    const provider = new anchor.AnchorProvider(connection, wallet, {
      skipPreflight: true,
      preflightCommitment: 'confirmed',
    })

    const program = new anchor.Program(IDL, PROGRAM_ID, provider);

    const [pool] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(POOL_SEED),
      wallet.publicKey.toBuffer()],
      program.programId
    );
    const builder = program.methods.withdraw(new anchor.BN(price * DECIMAL));
    builder.accounts({
      user: wallet.publicKey,
      pool: pool,
      systemProgram: anchor.web3.SystemProgram.programId,
    });

    builder.signers([]);
    const txId = await builder.rpc();
    if (!txId) return false;
    console.log('txId', txId)
    return true;

  }
  catch (error) {
    console.log("error", error)
    return null;
  }
}

// send transaction to reject booking
export const reject = async (
  connection: any,
  wallet: any,
  user: string,
  price: number
) => {
  try {
    const provider = new anchor.AnchorProvider(connection, wallet, {
      skipPreflight: true,
      preflightCommitment: 'confirmed',
    })

    const program = new anchor.Program(IDL, PROGRAM_ID, provider);

    const [pool] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(POOL_SEED),
      new anchor.web3.PublicKey(user).toBuffer()],
      program.programId
    );
    const builder = program.methods.reject(new anchor.BN(price * DECIMAL));
    builder.accounts({
      admin: wallet.publicKey,
      user: new anchor.web3.PublicKey(user),
      pool: pool,
      systemProgram: anchor.web3.SystemProgram.programId,
    });

    builder.signers([]);
    const txId = await builder.rpc();
    if (!txId) return false;
    console.log('txId', txId)
    return true;

  }
  catch (error) {
    console.log("error", error)
    return null;
  }
}

// send transaction to finalize booking
export const finalize = async (
  connection: any,
  wallet: any,
  admin: string,
  price: number
) => {
  try {
    const provider = new anchor.AnchorProvider(connection, wallet, {
      skipPreflight: true,
      preflightCommitment: 'confirmed',
    })

    const program = new anchor.Program(IDL, PROGRAM_ID, provider);

    const [config] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(CONFIG_SEED)],
      program.programId
    );
    
    const [pool] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(POOL_SEED),
      wallet.publicKey.toBuffer()],
      program.programId
    );

      
    const configData = await program.account.config.fetch(config);
    const builder = program.methods.finalize(new anchor.BN(price * DECIMAL));
    builder.accounts({
      config: config,
      user: wallet.publicKey,
      pool: pool,
      systemProgram: anchor.web3.SystemProgram.programId,
    });
    let remainAccounts: any[] = [];
    for (let i = 0; i < configData.count; i ++) {
      const royalties: any = configData.royalties;
      remainAccounts.push({
          pubkey: royalties[i].wallet,
          isSigner: false,
          isWritable: true
      })
    }
    remainAccounts.push({
      pubkey: new anchor.web3.PublicKey(admin),
      isSigner: false,
      isWritable: true
    });

    builder.remainingAccounts(remainAccounts);
    builder.signers([]);
    const txId = await builder.rpc();
    if (!txId) return false;
    console.log('txId', txId)
    return true;

  }
  catch (error) {
    console.log("error", error)
    return null;
  }
}
