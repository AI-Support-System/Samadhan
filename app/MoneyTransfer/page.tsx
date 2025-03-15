// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
'use client';
import React, { useState } from 'react';

const Transfer: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'contacts' | 'manual'>('contacts');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [searchContact, setSearchContact] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  const [manualRecipient, setManualRecipient] = useState({ name: '', accountNumber: '' });

  const contacts = [
    { id: 1, name: 'Emma Thompson', accountNumber: '**** 4582', avatar: 'https://public.readdy.ai/ai/img_res/6b95bc1ed239fdb2cab22b34351b8688.jpg' },
    { id: 2, name: 'Michael Chen', accountNumber: '**** 7891', avatar: 'https://public.readdy.ai/ai/img_res/769bbc4b34c953143fb3a7d50facd3ad.jpg' },
    { id: 3, name: 'Sarah Williams', accountNumber: '**** 3456', avatar: 'https://public.readdy.ai/ai/img_res/b4dc5c526fa91e434e09bdff47498d90.jpg' },
  ];

  const recentTransfers = [
    { id: 1, recipient: 'Emma Thompson', amount: 1250.00, date: '2025-03-10', purpose: 'Rent Payment' },
    { id: 2, recipient: 'Michael Chen', amount: 385.50, date: '2025-03-09', purpose: 'Dinner Split' },
    { id: 3, recipient: 'Sarah Williams', amount: 750.00, date: '2025-03-08', purpose: 'Project Payment' },
  ];

  const transferPurposes = [
    'Rent Payment',
    'Utility Bills',
    'Personal Transfer',
    'Business Payment',
    'Investment',
    'Other'
  ];

  const handleTransfer = () => {
    if (!amount || (!selectedRecipient && !manualRecipient.accountNumber)) return;
    setShowConfirmation(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white font-[Rajdhani] p-6">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <a 
              href="https://readdy.ai/home/bbab4429-1404-4fc5-9164-78c5c802e19a/fdeb71e2-cca0-4dbc-a9a1-4a4dff233b74" 
              data-readdy="true"
              className="text-[#00F0FF] hover:text-[#B026FF] transition-colors cursor-pointer"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Dashboard
            </a>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#00F0FF] to-[#B026FF] bg-clip-text text-transparent">
              NeoBank
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#B026FF] p-[2px]">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img 
                  src="https://public.readdy.ai/ai/img_res/62882379b068648f64569d9dce8257d0.jpg" 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          {/* Transfer Form */}
          <div className="col-span-8 bg-[#12121A] rounded-xl p-6 border border-[#1A1A2E]">
            <h2 className="text-2xl font-bold mb-6">Money Transfer</h2>
            
            <div className="mb-6">
              <div className="flex gap-4 mb-4">
                <button 
                  className={`flex-1 p-3 !rounded-button cursor-pointer ${selectedTab === 'contacts' ? 'bg-[#252538] text-[#00F0FF]' : 'bg-[#1A1A2E]'}`}
                  onClick={() => setSelectedTab('contacts')}
                >
                  <i className="fas fa-users mr-2"></i>
                  From Contacts
                </button>
                <button 
                  className={`flex-1 p-3 !rounded-button cursor-pointer ${selectedTab === 'manual' ? 'bg-[#252538] text-[#00F0FF]' : 'bg-[#1A1A2E]'}`}
                  onClick={() => setSelectedTab('manual')}
                >
                  <i className="fas fa-keyboard mr-2"></i>
                  Manual Input
                </button>
              </div>

              {selectedTab === 'contacts' && (
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search contacts..."
                      className="w-full bg-[#1A1A2E] border-none p-3 rounded-lg pl-10 text-sm"
                      value={searchContact}
                      onChange={(e) => setSearchContact(e.target.value)}
                    />
                    <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[#00F0FF]"></i>
                  </div>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {contacts.map(contact => (
                      <div 
                        key={contact.id}
                        className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer ${selectedRecipient === contact.name ? 'bg-[#252538]' : 'bg-[#1A1A2E]'}`}
                        onClick={() => setSelectedRecipient(contact.name)}
                      >
                        <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full" />
                        <div>
                          <div className="font-medium">{contact.name}</div>
                          <div className="text-sm text-gray-400">{contact.accountNumber}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTab === 'manual' && (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Recipient Name"
                    className="w-full bg-[#1A1A2E] border-none p-3 rounded-lg text-sm"
                    value={manualRecipient.name}
                    onChange={(e) => setManualRecipient({...manualRecipient, name: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Account Number"
                    className="w-full bg-[#1A1A2E] border-none p-3 rounded-lg text-sm"
                    value={manualRecipient.accountNumber}
                    onChange={(e) => setManualRecipient({...manualRecipient, accountNumber: e.target.value})}
                  />
                </div>
              )}
            </div>

            <div className="space-y-4 mb-6">
              <div className="relative">
                <input
                  type="number"
                  placeholder="Amount"
                  className="w-full bg-[#1A1A2E] border-none p-3 rounded-lg pl-10 text-sm"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00F0FF]">$</span>
              </div>

              <div className="relative">
                <select
                  className="w-full bg-[#1A1A2E] border-none p-3 rounded-lg text-sm appearance-none cursor-pointer"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                >
                  <option value="">Select Purpose</option>
                  {transferPurposes.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[#00F0FF]"></i>
              </div>
            </div>

            <button
              className="w-full bg-gradient-to-r from-[#00F0FF] to-[#B026FF] p-4 rounded-lg font-bold text-lg !rounded-button cursor-pointer"
              onClick={handleTransfer}
            >
              Transfer Money
            </button>
          </div>

          {/* Recent Transfers */}
          <div className="col-span-4 space-y-6">
            <div className="bg-[#12121A] rounded-xl p-6 border border-[#1A1A2E]">
              <h3 className="text-xl font-bold mb-4">Recent Transfers</h3>
              <div className="space-y-4">
                {recentTransfers.map(transfer => (
                  <div key={transfer.id} className="bg-[#1A1A2E] p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">{transfer.recipient}</div>
                      <div className="text-[#FF2E6C]">-${transfer.amount.toFixed(2)}</div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <div>{transfer.purpose}</div>
                      <div>{transfer.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#12121A] p-6 rounded-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Transfer</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-400">To:</span>
                <span>{selectedRecipient || manualRecipient.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Amount:</span>
                <span className="text-[#FF2E6C]">${amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Purpose:</span>
                <span>{purpose}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                className="flex-1 bg-[#1A1A2E] p-3 rounded-lg !rounded-button cursor-pointer"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button 
                className="flex-1 bg-gradient-to-r from-[#00F0FF] to-[#B026FF] p-3 rounded-lg font-bold !rounded-button cursor-pointer"
                onClick={() => setShowConfirmation(false)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transfer;

