import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Camera, Image as ImageIcon, MapPin, SearchIcon, CheckCircle2, Sparkles, Loader2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Report() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const initialType = queryParams.get('type');
  
  const [reportType, setReportType] = useState(initialType || null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [matchItem, setMatchItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [selectedCat, setSelectedCat] = useState('Bags');
  const [locationInput, setLocationInput] = useState('');
  const [description, setDescription] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (initialType) setReportType(initialType);
  }, [initialType]);

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (reportType === 'found' && !photoFile) {
      alert("A photo is mandatory when reporting a found item. Please help the owner verify it!");
      return;
    }

    setIsSubmitting(true);
    let photoUrl = null;

    try {
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('item-images')
          .upload(fileName, photoFile);
          
        if (uploadError) throw uploadError;
        
        const { data: publicUrlData } = supabase.storage
          .from('item-images')
          .getPublicUrl(fileName);
          
        photoUrl = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase
        .from('reports')
        .insert([{
          type: reportType,
          title: title,
          category: selectedCat,
          location: locationInput,
          description: description,
          photo_url: photoUrl
        }]);
        
      if (insertError) throw insertError;
      
      // Match Checking Logic for Lost Items
      if (reportType === 'lost') {
        const { data: foundItems } = await supabase
          .from('reports')
          .select('*')
          .eq('type', 'found')
          .eq('category', selectedCat); // Only compare within the same category to optimize

        if (foundItems && foundItems.length > 0) {
          // Extract keywords > 2 letters
          const queryWords = `${title} ${description}`.toLowerCase().split(/\W+/).filter(w => w.length > 2);
          
          const bestMatch = foundItems.find(item => {
            const itemText = `${item.title} ${item.description}`.toLowerCase();
            return queryWords.some(word => itemText.includes(word));
          });

          if (bestMatch) {
            setMatchItem(bestMatch);
          }
        }
      }

      setIsSubmitted(true);

    } catch (error) {
      console.error("Full error object:", error);
      alert(`Error details: ${error.message || JSON.stringify(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!reportType && !isSubmitted) {
    return (
      <div className="px-5 pt-12 pb-32 space-y-6 max-w-md mx-auto min-h-screen bg-background">
        <header className="mb-8">
           <button onClick={() => navigate('/')} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 shadow-sm active:scale-95 transition-transform mb-4 border border-gray-100">
             <ArrowLeft className="w-5 h-5" />
           </button>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Report Item</h1>
          <p className="text-sm text-gray-500 font-medium mt-2">What would you like to report today?</p>
        </header>

        <div className="space-y-4">
          <div onClick={() => setReportType('lost')} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm active:scale-95 transition-transform cursor-pointer flex items-center gap-5">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <SearchIcon className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">I lost an item</h3>
              <p className="text-xs text-gray-500 mt-1">Help me find my belongings</p>
            </div>
          </div>

          <div onClick={() => setReportType('found')} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm active:scale-95 transition-transform cursor-pointer flex items-center gap-5">
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Camera className="w-7 h-7 text-secondary" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">I found an item</h3>
              <p className="text-xs text-gray-500 mt-1">Help return it to the owner</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
       <div className="px-5 pt-20 pb-32 space-y-6 max-w-md mx-auto min-h-screen bg-background flex flex-col items-center justify-center text-center">
          {matchItem ? (
            <div className="bg-white p-8 rounded-[40px] shadow-lg shadow-primary/10 border border-primary/20 w-full transform transition-all animate-in zoom-in-95">
               <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-5 text-primary">
                  <Sparkles className="w-10 h-10" />
               </div>
               <h2 className="text-2xl font-black text-gray-800 mb-2">Potential Match!</h2>
               <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                 We found an item matching your keywords that was reported at <span className="font-bold text-gray-800">{matchItem.location}</span>.
               </p>
               
               <div className="bg-gray-50 rounded-2xl p-4 mb-8 text-left border border-gray-100">
                  <h4 className="font-bold text-sm text-gray-800 truncate">{matchItem.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{matchItem.description || "No description provided."}</p>
               </div>

               <button onClick={() => navigate(`/item/${matchItem.id}`)} className="w-full h-14 rounded-full bg-primary text-white font-bold text-base shadow-lg shadow-primary/20 active:scale-95 transition-transform mb-3">
                 View Match
               </button>
               <button onClick={() => navigate('/')} className="w-full h-14 rounded-full bg-white text-gray-600 font-bold text-base active:bg-gray-50 transition-colors">
                 Return Home
               </button>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 w-full transform transition-all animate-in zoom-in-95">
               <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-5 text-secondary">
                  <CheckCircle2 className="w-10 h-10" />
               </div>
               <h2 className="text-2xl font-black text-gray-800 mb-2">Report Submitted!</h2>
               <p className="text-sm text-gray-500 mb-8 leading-relaxed">We've securely saved your report. We'll notify you the moment a match is posted.</p>
               <button onClick={() => navigate('/')} className="w-full h-14 rounded-full bg-gray-900 text-white font-bold text-base shadow-lg shadow-gray-900/20 active:scale-95 transition-transform">
                 Return Home
               </button>
            </div>
          )}
       </div>
    )
  }

  const isLost = reportType === 'lost';

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md px-5 py-4 flex items-center gap-4">
        <button type="button" onClick={() => navigate('/')} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 shadow-sm active:scale-95 transition-transform border border-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-black text-gray-800 tracking-tight">Report {isLost ? 'Lost' : 'Found'} Item</h1>
      </header>

      <form onSubmit={handleSubmit} className="px-5 pt-4 space-y-6 max-w-md mx-auto">
        
        {/* Photo Upload Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <label className="text-sm font-bold text-gray-800">
              Item Photo {reportType === 'found' && <span className="text-red-500 ml-1">*</span>}
            </label>
            {isLost && <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">OPTIONAL</span>}
            {!isLost && <span className="text-[10px] font-bold text-primary bg-orange-50 px-2 py-1 rounded-md">REQUIRED</span>}
          </div>
          
          {photoPreview ? (
            <div className="relative w-full h-48 bg-gray-100 rounded-3xl overflow-hidden shadow-sm border border-gray-200">
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              <button type="button" onClick={removePhoto} className="absolute top-3 right-3 w-8 h-8 bg-gray-900/50 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-95">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
               <input type="file" id="camera-upload" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoSelect} />
               <label htmlFor="camera-upload" className="flex-1 h-24 bg-white border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors active:scale-[0.98] cursor-pointer">
                 <Camera className="w-6 h-6 mb-2 text-primary" />
                 <span className="text-xs font-semibold">Take Photo</span>
               </label>

               <input type="file" id="gallery-upload" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
               <label htmlFor="gallery-upload" className="flex-1 h-24 bg-white border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors active:scale-[0.98] cursor-pointer">
                 <ImageIcon className="w-6 h-6 mb-2 text-secondary" />
                 <span className="text-xs font-semibold">Upload Gallery</span>
               </label>
            </div>
          )}
        </div>

        {/* Item Title */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-800">What {isLost ? 'did you lose' : 'did you find'}? <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Black Nike Backpack" 
            className="w-full bg-white border border-gray-100 rounded-2xl px-4 py-3.5 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm"
          />
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-800">Category <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap gap-2">
            {['Electronics', 'Bags', 'Wallets', 'Keys', 'ID Cards', 'Other'].map((cat) => (
              <button 
                key={cat} 
                type="button"
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-sm border transition-colors ${selectedCat === cat ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-800">Where was it {isLost ? 'last seen' : 'found'}? <span className="text-red-500">*</span></label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              required
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="e.g. Main Library, 2nd Floor" 
              className="w-full bg-white border border-gray-100 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm"
            />
          </div>
          {/* Quick Location Chips */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pt-1">
             {['Library', 'Cafeteria', 'Hostel A', 'Sports Ground'].map(loc => (
               <span 
                 key={loc}
                 onClick={() => setLocationInput(loc)}
                 className="text-[10px] font-medium text-gray-500 bg-white border border-gray-100 shadow-sm px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer active:scale-95 hover:bg-gray-50"
               >
                 {loc}
               </span>
             ))}
          </div>
        </div>

        {/* Optional Description */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
             <label className="text-sm font-bold text-gray-800">Description</label>
             <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">OPTIONAL</span>
          </div>
          <textarea 
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Any distinctive features, colors, or contents?" 
            className="w-full bg-white border border-gray-100 rounded-2xl px-4 py-3.5 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm resize-none"
          ></textarea>
        </div>

        {/* Submit Action */}
        <div className="pt-4 pb-10">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full h-14 rounded-full font-bold text-base shadow-lg transition-all flex items-center justify-center ${isSubmitting ? 'bg-gray-400 text-white cursor-not-allowed shadow-none' : 'bg-primary text-white shadow-primary/20 active:bg-primary-dark active:scale-[0.98]'}`}
          >
            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Submit Report'}
          </button>
        </div>

      </form>
    </div>
  )
}
