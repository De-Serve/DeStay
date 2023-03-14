
import * as anchor from '@project-serum/anchor';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';
import { Commitment, ConnectionConfig } from '@solana/web3.js';
import DEV_KEY from '../devnet.json';
import MAIN_KEY from '../devnet.json';
import { IDL } from '../target/types/ordering_system';
const { PublicKey, Keypair, Connection, SystemProgram } = anchor.web3;

const DEV_ENV = {
  CLUSTER_API: 'https://api.devnet.solana.com',
  PROGRAM_ID: '3JFgCsPEVh7RUy4PP1kN6ittyXuXNsxRWcY25BmncgAn',
  ADMIN: DEV_KEY 
};

const MAIN_ENV = {
  CLUSTER_API: 'https://solana-api.projectserum.com',
  PROGRAM_ID: '48aQojFzriVmURmUbdYBydyjACg74R1YzSNUznVS3ngQ',
  ADMIN: MAIN_KEY 
};

const ENV = DEV_ENV;
const CONFIG_SEEDS = 'config';

(async () => {
  try {

    const seed = Uint8Array.from(ENV.ADMIN.slice(0, 32));
    const UPDATE_AUTHORITY = Keypair.fromSeed(seed);
  
    
    const connection = new Connection(ENV.CLUSTER_API, {
      skipPreflight: true,
      preflightCommitment: 'confirmed' as Commitment,
    } as ConnectionConfig );
  
    const provider = new anchor.AnchorProvider(connection, new NodeWallet(UPDATE_AUTHORITY), {
      skipPreflight: true,
      preflightCommitment: 'confirmed' as Commitment,
    } as ConnectionConfig);
    const program = new anchor.Program(IDL, new PublicKey(ENV.PROGRAM_ID), provider);
  
    let [config, _nonce] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(CONFIG_SEEDS)],
      program.programId
    );
  
    const result = await program.rpc.initialize(
      [{
        wallet: new PublicKey('BpUBejWAKv3VpNci2isyjDQsUGP4FNu5biY1GmMRVdJB'),
        percent: new anchor.BN(10 * 1000)
      }],
      {
      accounts: {
        config: config,
        admin: provider.wallet.publicKey, // Admin wallet
        systemProgram: SystemProgram.programId
      }
    })
    console.log('result', result);
  }
  catch (error) {
    console.log('error', error);
  }
})()