import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, MessageSquareText, Bell, AlertCircle, Send, XCircle, Camera, Loader2, Image as ImageIcon } from 'lucide-react';
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
  
  const [askDetailsModal, setAskDetailsModal] = useState(null);
  const [askDetailsText, setAskDetailsText] = useState('');
  const [askDetailsPhoto, setAskDetailsPhoto] = useState(false);
  const [moreInfoFiles, setMoreInfoFiles] = useState({});
  const [uploadingInfo, setUploadingInfo] = useState(false);

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
        .in('status', ['pending', 'more_info_needed', 'claimed', 'returned'])
        .order('created_at', { ascending: false });

      if (data) {
        const relevantNotifs = data.filter(item => {
          let claimData = { requester: '' };
          try { if (item.claimed_by) claimData = JSON.parse(item.claimed_by); } catch(e){}
          
          // Finder sees incoming requests
          if (item.status === 'pending' && item.reported_by === userName) return true;
          // Claimer sees requests for more info
          if (item.status === 'more_info_needed' && claimData.requester === userName) return true;
          // Claimer sees meetup instructions OR returned success
          if ((item.status === 'claimed' || item.status === 'returned') && claimData.requester === userName && claimData.meetup) return true;
          
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

  const handleAskDetailsClick = (req) => {
    setAskDetailsModal(req);
    setAskDetailsText('');
    setAskDetailsPhoto(false);
  };

  const confirmRequestMoreInfo = async () => {
    const req = askDetailsModal;
    const updatedClaimData = JSON.stringify({ 
      ...req.claimData, 
      ask_details_text: askDetailsText,
      ask_details_photo: askDetailsPhoto
    });
    
    await supabase.from('reports').update({ status: 'more_info_needed', claimed_by: updatedClaimData }).eq('id', req.id);
    showToast("Requested more details from the user.");
    setNotifs(notifs.filter(n => n.id !== req.id));
    setAskDetailsModal(null);
  };

  const handleDecline = async (id) => {
    await supabase.from('reports').update({ status: 'open', claimed_by: null }).eq('id', id);
    showToast("Claim declined. Item is open again.");
    setNotifs(notifs.filter(n => n.id !== id));
  };

  const handleSendMoreInfo = async (item) => {
    if (uploadingInfo) return;
    
    const additionalText = moreInfoInputs[item.id] || '';
    const file = moreInfoFiles[item.id];
    
    if (item.claimData.ask_details_photo && !file) {
      showToast("Please upload a photo as requested.");
      return;
    }
    
    if (!item.claimData.ask_details_photo && !additionalText.trim()) return;
    
    setUploadingInfo(true);
    let photoUrl = null;
    
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `proofs/${fileName}`;
      
      const { error: uploadError } = await supabase.storage.from('item-images').upload(filePath, file);
      if (!uploadError) {
        const { data } = supabase.storage.from('item-images').getPublicUrl(filePath);
        photoUrl = data.publicUrl;
      }
    }
    
    let newProof = item.claimData.proof;
    if (additionalText.trim()) {
      newProof += "\n\nAdditional Details: " + additionalText;
    }
    
    const updatedClaimData = JSON.stringify({ 
      ...item.claimData, 
      proof: newProof,
      proof_photo_url: photoUrl || item.claimData.proof_photo_url,
      ask_details_text: null,
      ask_details_photo: false
    });
    
    await supabase.from('reports').update({ status: 'pending', claimed_by: updatedClaimData }).eq('id', item.id);
    showToast("Details sent for review!");
    setNotifs(notifs.filter(n => n.id !== item.id));
    setUploadingInfo(false);
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
            const isReturned = req.status === 'returned';
            
            return (
              <div key={req.id} className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPending ? 'bg-orange-50 text-primary' : (isMeetup || isReturned) ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                    {isPending ? <ShieldCheck className="w-5 h-5" /> : (isMeetup || isReturned) ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">
                      {isPending ? 'Claim Request' : isReturned ? 'Item Returned' : isMeetup ? 'Return Approved' : 'More Info Requested'}
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{req.title}</p>
                  </div>
                </div>
                
                {isPending ? (
                  <>
                    <p className="text-sm text-gray-700 mb-2"><strong>{req.claimData.requester}</strong> has {req.type === 'lost' ? 'submitted details about finding your item:' : 'submitted proof of ownership:'}</p>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-5 relative z-10 shadow-inner whitespace-pre-wrap">
                      <p className="text-sm text-gray-600 font-medium italic">"{req.claimData.proof}"</p>
                    </div>
                    {req.claimData.proof_photo_url && (
                      <div className="mb-4 rounded-xl overflow-hidden border border-gray-100 shadow-sm relative z-10">
                        <img src={req.claimData.proof_photo_url} alt="Proof" className="w-full h-auto object-cover max-h-48" />
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                       <button onClick={() => handleDecline(req.id)} className="flex-1 py-3 font-bold text-[11px] rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center gap-1 active:scale-95">
                         <XCircle className="w-3.5 h-3.5" /> Decline
                       </button>
                       <button onClick={() => handleAskDetailsClick(req)} className="flex-1 py-3 font-bold text-[11px] rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex items-center justify-center gap-1 active:scale-95">
                         <MessageSquareText className="w-3.5 h-3.5" /> Details
                       </button>
                       <button onClick={() => handleApproveClick(req)} className="flex-1 py-3 font-bold text-[11px] rounded-xl bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary-dark transition-colors flex items-center justify-center gap-1 active:scale-95">
                         <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                       </button>
                    </div>
                  </>
                ) : isMoreInfo ? (
                  <>
                    <p className="text-sm text-gray-700 mb-3">
                      {req.type === 'lost' 
                        ? <>The owner of <strong>{req.title}</strong> has requested you to share some more details so they can confirm it belongs to them.</>
                        : <>The finder of <strong>{req.title}</strong> has requested more specific details from you to verify ownership.</>
                      }
                    </p>
                    
                    {req.claimData.ask_details_text && (
                      <div className="bg-orange-50 p-3 rounded-xl mb-3 border border-orange-100 relative z-10">
                        <p className="text-sm text-orange-800 italic">"{req.claimData.ask_details_text}"</p>
                      </div>
                    )}
                    
                    {req.claimData.ask_details_photo && (
                       <div className="mb-3 relative z-10">
                         {moreInfoFiles[req.id] ? (
                           <label className="block w-full py-4 px-4 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:bg-gray-50 transition-colors bg-white">
                             <span className="text-sm text-gray-500 flex flex-col items-center justify-center gap-1">
                               <CheckCircle2 className="w-6 h-6 text-green-500 mb-1" /> 
                               <span className="font-bold text-primary">{moreInfoFiles[req.id].name}</span>
                               <span className="text-xs text-gray-400 mt-1">Tap to change</span>
                             </span>
                             <input 
                               type="file" 
                               accept="image/*" 
                               className="hidden" 
                               onChange={(e) => {
                                 if (e.target.files[0]) {
                                   setMoreInfoFiles({...moreInfoFiles, [req.id]: e.target.files[0]});
                                 }
                               }}
                             />
                           </label>
                         ) : (
                           <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                             <p className="text-sm font-bold text-gray-700 text-center mb-4 leading-snug">Owner requested a photo. Take or upload a pic to help them identify and confirm.</p>
                             <div className="flex gap-2">
                               <label className="flex-1 py-3 px-2 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:bg-white transition-colors bg-gray-100">
                                 <span className="text-xs text-gray-500 flex flex-col items-center justify-center gap-1">
                                   <Camera className="w-5 h-5 text-gray-500" /> 
                                   <span className="font-bold text-gray-700">Camera</span>
                                 </span>
                                 <input 
                                   type="file" 
                                   accept="image/*"
                                   capture="environment"
                                   className="hidden" 
                                   onChange={(e) => {
                                     if (e.target.files[0]) {
                                       setMoreInfoFiles({...moreInfoFiles, [req.id]: e.target.files[0]});
                                     }
                                   }}
                                 />
                               </label>
                               
                               <label className="flex-1 py-3 px-2 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:bg-white transition-colors bg-gray-100">
                                 <span className="text-xs text-gray-500 flex flex-col items-center justify-center gap-1">
                                   <ImageIcon className="w-5 h-5 text-gray-500" /> 
                                   <span className="font-bold text-gray-700">Gallery</span>
                                 </span>
                                 <input 
                                   type="file" 
                                   accept="image/*" 
                                   className="hidden" 
                                   onChange={(e) => {
                                     if (e.target.files[0]) {
                                       setMoreInfoFiles({...moreInfoFiles, [req.id]: e.target.files[0]});
                                     }
                                   }}
                                 />
                               </label>
                             </div>
                           </div>
                         )}
                       </div>
                    )}
                    
                    <div className="flex items-center gap-2 mb-2 relative z-10">
                      <input 
                        type="text" 
                        value={moreInfoInputs[req.id] || ''}
                        onChange={(e) => setMoreInfoInputs({...moreInfoInputs, [req.id]: e.target.value})}
                        placeholder="Provide more details..." 
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <button 
                        onClick={() => handleSendMoreInfo(req)}
                        disabled={uploadingInfo || (req.claimData.ask_details_photo ? !moreInfoFiles[req.id] : !moreInfoInputs[req.id]?.trim())}
                        className="w-12 h-11 rounded-xl bg-primary text-white flex items-center justify-center flex-shrink-0 disabled:bg-gray-300 active:scale-95 transition-transform"
                      >
                        {uploadingInfo ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-1" />}
                      </button>
                    </div>
                  </>
                ) : (isMeetup || isReturned) ? (
                  <>
                    <p className="text-sm text-gray-700 mb-3">
                      {isReturned 
                        ? (req.type === 'found' ? 'You have confirmed the physical return of this item.' : 'The owner has confirmed the physical return of this item.') 
                        : (req.type === 'found' ? 'Your ownership was verified. The finder has provided instructions for returning your item.' : 'The owner has approved your claim and provided meetup instructions.')}
                    </p>
                    {isMeetup && (
                      <div className="bg-green-50 p-4 rounded-xl border border-green-100 mb-2 relative z-10 shadow-inner whitespace-pre-wrap">
                        <p className="text-sm text-green-800 font-medium">{req.claimData.meetup}</p>
                      </div>
                    )}
                    <div className="flex gap-2 mt-2 relative z-10">
                      <button onClick={() => navigate(`/item/${req.id}`)} className="flex-1 py-3 font-bold text-xs rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 active:scale-95">
                        View Post
                      </button>
                      
                      {req.type === 'found' && isMeetup && (
                        <button 
                          onClick={async () => {
                            const { error } = await supabase.from('reports').update({ status: 'returned' }).eq('id', req.id);
                            if (!error) {
                              showToast("Item marked as returned!");
                              setNotifs(notifs.map(n => n.id === req.id ? {...n, status: 'returned'} : n));
                            } else {
                              showToast("Failed to confirm. You might need to update the database status constraint.");
                            }
                          }}
                          className="flex-1 py-3 font-bold text-xs rounded-xl bg-green-500 text-white shadow-md shadow-green-500/20 hover:bg-green-600 transition-colors flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          Confirm Return
                        </button>
                      )}
                    </div>
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
      {/* Ask Details Modal */}
      {askDetailsModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-5 animate-in fade-in">
          <div className="bg-white rounded-[32px] p-6 w-full max-w-sm shadow-xl animate-in zoom-in-95">
            <h3 className="text-xl font-black text-gray-800 mb-2">Request More Info</h3>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">{askDetailsModal.type === 'lost' ? `Ask ${askDetailsModal.claimData.requester} for a photo or more details to confirm.` : `Ask ${askDetailsModal.claimData.requester} for another specific detail.`}</p>
            
            <textarea 
              value={askDetailsText}
              onChange={(e) => setAskDetailsText(e.target.value)}
              placeholder="e.g., Can you describe any scratches or marks on it?"
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[90px] resize-none mb-4"
            />
            
            {askDetailsModal.type === 'lost' && (
              <label className="flex items-center gap-3 mb-6 p-4 border border-gray-100 rounded-2xl bg-gray-50 cursor-pointer active:scale-[0.98] transition-transform">
                <input 
                  type="checkbox" 
                  checked={askDetailsPhoto} 
                  onChange={(e) => setAskDetailsPhoto(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-bold text-gray-700">Request a photo of the item</span>
              </label>
            )}
            
            <div className="flex gap-3">
              <button 
                onClick={() => setAskDetailsModal(null)}
                className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-full active:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmRequestMoreInfo}
                className="flex-1 bg-primary text-white font-bold py-3.5 rounded-full shadow-lg shadow-primary/20 active:bg-primary-dark transition-colors flex justify-center items-center"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
