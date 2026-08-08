import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, MessageSquareText, Bell, AlertCircle, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Loader from '../components/Loader';

export default function Notifications() {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moreInfoInputs, setMoreInfoInputs] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const [meetupModal, setMeetupModal] = useState(null);
  const [meetupText, setMeetupText] = useState('');
  const [meetupName, setMeetupName] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    const fetchNotifs = async () => {
      const userName = localStorage.getItem('reclaim_user_name');
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .in('status', ['pending', 'more_info_needed', 'claimed'])
        .order('created_at', { ascending: false });

      if (data) {
        const relevantNotifs = data.filter(item => {
          let claimData = { requester: '' };
          try { if (item.claimed_by) claimData = JSON.parse(item.claimed_by); } catch(e){}
          
          // Finder sees incoming requests
          if (item.status === 'pending' && item.reported_by === userName) return true;
          // Claimer sees requests for more info
          if (item.status === 'more_info_needed' && claimData.requester === userName) return true;
          // Claimer sees meetup instructions
          if (item.status === 'claimed' && claimData.requester === userName && claimData.meetup) return true;
          
          return false;
        }).map(item => {
          let claimData = { requester: 'Unknown', proof: 'No proof provided' };
          try { if (item.claimed_by) claimData = JSON.parse(item.claimed_by); } catch(e){}
          
          return {
            ...item,
            claimData
          };
        });
        
        setNotifs(relevantNotifs);
      }
      setLoading(false);
    };
    fetchNotifs();
  }, []);

  const handleApproveClick = (req) => {
    setMeetupModal(req);
    setMeetupText('');
    setMeetupName('');
  };

  const confirmApprove = async () => {
    if (!meetupText.trim() || !meetupName.trim()) return;
    const req = meetupModal;
    
    const combinedMeetup = `Finder: ${meetupName}\n\nMeetup Instructions:\n${meetupText}`;
    const updatedClaimData = JSON.stringify({ ...req.claimData, meetup: combinedMeetup });
    
    await supabase.from('reports').update({ status: 'claimed', claimed_by: updatedClaimData }).eq('id', req.id);
    showToast("Approved! Meetup instructions sent.");
    setNotifs(notifs.filter(n => n.id !== req.id));
    setMeetupModal(null);
  };

  const handleRequestMoreInfo = async (id) => {
    await supabase.from('reports').update({ status: 'more_info_needed' }).eq('id', id);
    showToast("Requested more details from the user.");
    setNotifs(notifs.filter(n => n.id !== id));
  };

  const handleSendMoreInfo = async (item) => {
    const additionalInfo = moreInfoInputs[item.id];
    if (!additionalInfo || !additionalInfo.trim()) return;
    
    const newProof = item.claimData.proof + "\n\nAdditional Details: " + additionalInfo;
    const updatedClaimData = JSON.stringify({ ...item.claimData, proof: newProof });
    
    await supabase.from('reports').update({ status: 'pending', claimed_by: updatedClaimData }).eq('id', item.id);
    showToast("Details sent for review!");
    setNotifs(notifs.filter(n => n.id !== item.id));
  };

  return (
    <div className="px-5 pt-12 pb-32 max-w-md mx-auto min-h-screen bg-background relative overflow-hidden">
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl z-[100] animate-in slide-in-from-top-5 text-sm font-bold flex items-center gap-2 whitespace-nowrap">
          <CheckCircle2 className="w-4 h-4 text-green-400" /> {toastMessage}
        </div>
      )}

      <div className="absolute top-[-5%] right-[-10%] w-64 h-64 bg-orange-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      
      <header className="mb-6 relative z-10">
        <h1 className="text-3xl font-black text-gray-800 tracking-tight">Notifications</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">Review proofs and manage item returns.</p>
      </header>

      {loading ? (
        <Loader message="Checking for updates..." />
      ) : (
        <div className="space-y-4 relative z-10">
          {notifs.length === 0 && (
            <div className="text-center mt-20">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-bold">No new notifications</p>
            </div>
          )}
          
          {notifs.map(req => {
            const isPending = req.status === 'pending';
            const isMoreInfo = req.status === 'more_info_needed';
            const isMeetup = req.status === 'claimed';
            
            return (
              <div key={req.id} className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPending ? 'bg-orange-50 text-primary' : isMeetup ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                    {isPending ? <ShieldCheck className="w-5 h-5" /> : isMeetup ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">
                      {isPending ? 'Claim Request' : isMeetup ? 'Return Arranged' : 'More Info Requested'}
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{req.title}</p>
                  </div>
                </div>
                
                {isPending ? (
                  <>
                    <p className="text-sm text-gray-700 mb-2"><strong>{req.claimData.requester}</strong> has submitted proof of ownership:</p>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-5 relative z-10 shadow-inner whitespace-pre-wrap">
                      <p className="text-sm text-gray-600 font-medium italic">"{req.claimData.proof}"</p>
                    </div>
                    
                    <div className="flex gap-2">
                       <button onClick={() => handleRequestMoreInfo(req.id)} className="flex-1 py-3 font-bold text-xs rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5 active:scale-95">
                         <MessageSquareText className="w-4 h-4" /> Ask Details
                       </button>
                       <button onClick={() => handleApproveClick(req)} className="flex-1 py-3 font-bold text-xs rounded-xl bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary-dark transition-colors flex items-center justify-center gap-1.5 active:scale-95">
                         <CheckCircle2 className="w-4 h-4" /> Approve
                       </button>
                    </div>
                  </>
                ) : isMoreInfo ? (
                  <>
                    <p className="text-sm text-gray-700 mb-3">The finder of <strong>{req.title}</strong> has requested one more specific detail from you to verify ownership.</p>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <input 
                        type="text" 
                        value={moreInfoInputs[req.id] || ''}
                        onChange={(e) => setMoreInfoInputs({...moreInfoInputs, [req.id]: e.target.value})}
                        placeholder="Provide another specific detail..." 
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <button 
                        onClick={() => handleSendMoreInfo(req)}
                        disabled={!moreInfoInputs[req.id]?.trim()}
                        className="w-12 h-11 rounded-xl bg-primary text-white flex items-center justify-center flex-shrink-0 disabled:bg-gray-300 active:scale-95 transition-transform"
                      >
                        <Send className="w-5 h-5 ml-1" />
                      </button>
                    </div>
                  </>
                ) : isMeetup ? (
                  <>
                    <p className="text-sm text-gray-700 mb-3">Your ownership was verified. The finder has provided instructions for returning your item.</p>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100 mb-2 relative z-10 shadow-inner whitespace-pre-wrap">
                      <p className="text-sm text-green-800 font-medium">{req.claimData.meetup}</p>
                    </div>
                    <button onClick={() => navigate(`/item/${req.id}`)} className="w-full mt-2 py-3 font-bold text-xs rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 active:scale-95">
                      View Original Post
                    </button>
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      {/* Meetup Modal */}
      {meetupModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-5 animate-in fade-in">
          <div className="bg-white rounded-[32px] p-6 w-full max-w-sm shadow-xl animate-in zoom-in-95">
            <h3 className="text-xl font-black text-gray-800 mb-2">Final Step: Meetup</h3>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">How should {meetupModal.claimData.requester} find you?</p>
            
            <input 
              type="text"
              value={meetupName}
              onChange={(e) => setMeetupName(e.target.value)}
              placeholder="Your Name or Phone Number"
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 mb-3"
            />
            
            <textarea 
              value={meetupText}
              onChange={(e) => setMeetupText(e.target.value)}
              placeholder="e.g., Let's meet at the campus cafeteria tomorrow at 1:00 PM."
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[90px] resize-none mb-6"
            />
            
            <div className="flex gap-3">
              <button 
                onClick={() => setMeetupModal(null)}
                className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-full active:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmApprove}
                disabled={!meetupText.trim() || !meetupName.trim()}
                className="flex-1 bg-primary text-white font-bold py-3.5 rounded-full shadow-lg shadow-primary/20 active:bg-primary-dark transition-colors flex justify-center items-center disabled:opacity-50 disabled:bg-gray-300"
              >
                Approve & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
