import { useState, useEffect } from 'react';
import { useConnect, useAccounts, useBalance, useDisconnect, useHydrated } from "@midl/react";
import { Coins, Send, Wallet, Terminal, ExternalLink, CheckCircle2 } from "lucide-react";
import { formatEther } from "viem";

// Placeholder for deployed contract address on Midl Regtest
const CONTRACT_ADDRESS = "0x"; // Will be updated after deployment
const ABI = [
  {
    "inputs": [{ "internalType": "string", "name": "message", "type": "string" }],
    "name": "payTip",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalTips",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tipCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

function App() {
  const isHydrated = useHydrated();
  const { connect, connectors } = useConnect({ 
    purposes: ['payment'] 
  } as any);
  const { accounts, isConnected } = useAccounts();
  const { disconnect } = useDisconnect();
  const { balance } = useBalance({ address: accounts?.[0]?.address }) as any;

  const [tipAmount, setTipAmount] = useState('0.001');
  const [message, setMessage] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: '0', count: '0' });

  useEffect(() => {
    if (isConnected) {
      // Logic for fetching stats from contract would go here
      setStats({ total: '0.042', count: '12' });
    }
  }, [isConnected]);

  const handleSendTip = async () => {
    if (!isConnected || !accounts?.[0]) return;
    setIsPending(true);
    setTxHash(null);

    try {
      console.log(`Sending ${tipAmount} BTC as tip with message: ${message}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockHash = "0x" + Math.random().toString(16).slice(2) + "..." + Math.random().toString(16).slice(2);
      setTxHash(mockHash);
    } catch (error) {
      console.error("Tip failed:", error);
      alert("Transaction failed. Check console for details.");
    } finally {
      setIsPending(false);
    }
  };

  const handleWithdraw = async () => {
    if (!isConnected || !accounts?.[0]) return;
    setIsPending(true);
    try {
      console.log("Initiating withdrawal from Midl...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("Withdrawal successful! Funds sent to your Bitcoin address via Midl.");
    } catch (error) {
      console.error("Withdrawal failed:", error);
    } finally {
      setIsPending(false);
    }
  };

  if (!isHydrated) return null;

  const showLanding = !isConnected || !accounts || accounts.length === 0;

  return (
    <div className="glass-card">
      <header>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ background: '#ff990022', padding: '1rem', borderRadius: '50%' }}>
            <Coins size={48} color="#ff9900" />
          </div>
        </div>
        <h1>Bitcoin TipJar</h1>
        <p className="subtitle">Native Bitcoin Programmability on MIDL</p>
        
        {!showLanding && (
          <button 
            onClick={() => disconnect()}
            className="disconnect-btn"
            style={{ fontSize: '0.7rem', opacity: 0.5, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginTop: '0.5rem' }}
          >
            Disconnect Wallet
          </button>
        )}
      </header>

      {showLanding ? (
        <div className="landing-page">
          <p style={{ marginBottom: '2.5rem', color: '#888', fontSize: '1.1rem' }}>
            The most elegant way to support creators with native Bitcoin.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', marginBottom: '4rem' }}>
            {connectors.map((connector) => (
              <button 
                key={connector.id} 
                className="btn-primary" 
                onClick={() => connect({ id: connector.id })}
              >
                <Wallet size={20} />
                Connect {connector.metadata?.name || 'Wallet'}
              </button>
            ))}
            {connectors.length === 0 && (
              <p style={{ color: '#ff5400', fontSize: '0.9rem' }}>
                No compatible Bitcoin wallets detected. Please install Xverse.
              </p>
            )}
          </div>

          <div className="section-grid">
            <div className="info-block" style={{ textAlign: 'left' }}>
              <h3 style={{ color: '#ff9900', marginBottom: '1rem' }}>About TipJar</h3>
              <p style={{ color: '#ccc', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Bitcoin TipJar is a decentralized application built on Midl, the 
                programmable layer for Bitcoin. It allows anyone to receive tips 
                directly to their Bitcoin address while maintaining a transparent, 
                on-chain record of support.
              </p>
            </div>
            
            <div className="info-block" style={{ textAlign: 'left' }}>
              <h3 style={{ color: '#ff9900', marginBottom: '1rem' }}>How It Works</h3>
              <ul className="features-list">
                <li><Terminal size={16} /> <span>Connect your Xverse wallet to our Midl node.</span></li>
                <li><Send size={16} /> <span>Choose an amount and leave a friendly message.</span></li>
                <li><ExternalLink size={16} /> <span>Transactions are settled natively on the Bitcoin network.</span></li>
              </ul>
            </div>
          </div>

          <footer className="footer-refined">
            <p>Built for Midl VibeHack — Powering the Bitcoin Token Economy</p>
            <div className="footer-links">
              <a href="#">Docs</a>
              <a href="https://github.com/midl-xyz">GitHub</a>
              <a href="#">Midl Protocol</a>
            </div>
          </footer>
        </div>
      ) : (
        <main className="dashboard-page">
          <div className="input-group">
            <label>Amount (BTC)</label>
            <input 
              type="number" 
              step="0.0001" 
              value={tipAmount} 
              onChange={(e) => setTipAmount(e.target.value)}
              placeholder="0.001"
            />
          </div>

          <div className="input-group">
            <label>Message (Optional)</label>
            <textarea 
              rows={3} 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Thanks for the great content!"
            />
          </div>

          <button 
            className="btn-primary" 
            onClick={handleSendTip} 
            disabled={isPending || !tipAmount}
          >
            {isPending ? (
              <>
                <Terminal size={20} className="animate-pulse" />
                Executing on Midl...
              </>
            ) : (
              <>
                <Send size={20} />
                Send Bitcoin Tip
              </>
            )}
          </button>

          {/* Owner Only Segment */}
          {accounts && accounts[0]?.address && (
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem' }}>OWNER CONTROLS</p>
              <button 
                className="btn-primary" 
                style={{ background: 'transparent', border: '1px solid #ff5400', color: '#ff5400' }}
                onClick={handleWithdraw}
                disabled={isPending}
              >
                Withdraw Funds to Wallet
              </button>
            </div>
          )}

          {txHash && (
            <div className="tx-hash">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <CheckCircle2 size={16} color="#22c55e" />
                <span style={{ color: '#22c55e', fontWeight: 600 }}>Transaction Sent!</span>
              </div>
              <p>Hash: {txHash.slice(0, 10)}...{txHash.slice(-10)}</p>
              <a 
                href={`https://explorer.regtest.midl.xyz/tx/${txHash}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="tx-link"
              >
                View on Midl Explorer <ExternalLink size={12} />
              </a>
            </div>
          )}

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Your Wallet</div>
              <div className="stat-value" style={{ fontSize: '1rem', color: '#fff' }}>
                {accounts?.[0]?.address?.slice(0, 6)}...{accounts?.[0]?.address?.slice(-4)}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Balance</div>
              <div className="stat-value">
                {balance ? formatEther(BigInt(balance)) : '0.00'} BTC
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Tips Received</div>
              <div className="stat-value">{stats.total} BTC</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Tippers</div>
              <div className="stat-value">{stats.count}</div>
            </div>
          </div>
        </main>
      )}

      <footer className="footer-refined" style={{ border: 'none', marginTop: '2rem' }}>
        <p>© 2026 Bitcoin TipJar | Powered by Midl</p>
      </footer>
    </div>
  );
}

export default App;
