import { useSelector } from 'react-redux';
import './App.css';
import RenderModal from './modals/RenderModal/RenderModal';
import AppRoutes from './routes/AppRoutes';
import { ToastContainerCustom } from "./components/CustomToast/CustomToast";
import { useEffect } from 'react';
import { fcmNotificationService } from './services/fcmNotificationService';

function App() {
  const isModalOpen = useSelector((state) => state.modal.isOpen);
  
  useEffect(() => {
    // Initialize FCM notifications globally when the app loads
    const initializeFCM = async () => {
      try {
        await fcmNotificationService.requestPermissionAndInitialize();
      } catch (error) {
        console.error('Error initializing FCM notifications:', error);
      }
    };

    initializeFCM();
  }, []);

  return (
    
    <div className="App">
      <AppRoutes />
      {isModalOpen && <RenderModal />}
 <ToastContainerCustom /> {/* 👈 must be here */}
    </div>
  );
}

export default App;
