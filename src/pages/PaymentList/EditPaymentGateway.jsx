import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import FileInputWithPreview from '../../components/FileInputWithPreview/FileInputWithPreview';
import { showCustomToast, ToastContainerCustom } from '../../components/CustomToast/CustomToast';
import styles from './EditPaymentGateway.module.css';
import { getPaymentGatewayById, updatePaymentGateway } from '../../services/paymentService';
import Loader from '../../components/Loader/Loader';

const EditPaymentGateway = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the ID from the route params

  // Form state
  const [formData, setFormData] = useState({
    gatewayName: '',
    gatewaySubtitle: '',
    gatewayImage: null,
    attributes: [],
    status: 'Publish',
    showOnWallet: 'Yes'
  });

  // Local state for tags
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch existing data from API
  useEffect(() => {
    const fetchPaymentGateway = async () => {
      try {
        setLoading(true);
        const response = await getPaymentGatewayById(id);
        
        if (response.success && response.data) {
          const gateway = response.data;
          setFormData({
            gatewayName: gateway.gateway || '',
            gatewaySubtitle: gateway.subtitle || '',
            gatewayImage: gateway.image || null,
            attributes: gateway.attributes || [],
            status: gateway.status || 'Publish',
            showOnWallet: gateway.showOnWallet || 'Yes'
          });
        } else {
          // Handle case where payment gateway is not found
          showCustomToast('Payment gateway not found!', 'error');
          navigate('/paymentlist');
        }
      } catch (error) {
        console.error('Error fetching payment gateway:', error);
        showCustomToast('Error fetching payment gateway!', 'error');
        
        // Set mock data as fallback
        setFormData({
          gatewayName: id == 1 ? 'Razorpay' : id == 2 ? 'Paypal' : 'Stripe',
          gatewaySubtitle: id == 1 
            ? 'Card, UPI, Net banking, Wallet(Phone Pe, Amazon Pay, Freecharge)' 
            : id == 2 
            ? 'Credit/Debit card with Easier way to pay – online and on your mobile.' 
            : 'Accept all major debit and credit cards from customers in every country',
          gatewayImage: null,
          attributes: id == 1 ? ['rzp_live_RIG0sPZeoMaFNF', 'test_attribute'] : id == 2 ? ['paypal_attr_1'] : ['stripe_attr_1'],
          status: 'Publish',
          showOnWallet: 'Yes'
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPaymentGateway();
    }
  }, [id, navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (imageFile) => {
    setFormData(prev => ({
      ...prev,
      gatewayImage: imageFile
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.attributes.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        attributes: [...prev.attributes, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.gatewayName || !formData.gatewaySubtitle) {
      showCustomToast('Please fill in all required fields (Gateway Name and Subtitle)');
      return;
    }

    try {
      // Prepare the payload
      const payload = {
        gateway: formData.gatewayName,
        subtitle: formData.gatewaySubtitle,
        image: formData.gatewayImage,
        attributes: formData.attributes,
        status: formData.status,
        showOnWallet: formData.showOnWallet
      };

      // Make API call to update the payment gateway
      const response = await updatePaymentGateway(id, payload);
      
      if (response.success) {
        // Show success toast
        showCustomToast('Payment Gateway updated successfully!');
        
        // Redirect after a short delay to allow toast to be seen
        setTimeout(() => {
          navigate('/paymentlist'); // Redirect back to payment list
        }, 1000);
      } else {
        showCustomToast('Failed to update payment gateway!', 'error');
      }
    } catch (error) {
      console.error('Error updating payment gateway:', error);
      showCustomToast('Error updating payment gateway!', 'error');
    }
  };

  const handleCancel = () => {
    // Confirm before canceling
    if (window.confirm('Are you sure you want to discard changes?')) {
      navigate('/paymentlist'); // Go back to payment list
    }
  };

  if (loading) {
    return (
      <div className={styles['edit-payment-gateway-container']}>
        <div className={styles['page-header']}>
          <h1 className={styles['page-title']}>Edit Payment Gateway</h1>
        </div>
        <div className={styles['form-card']}>
          Loading payment gateway data...
        </div>
        <ToastContainerCustom />
      </div>
    );
  }

  return (
    <div className={styles['edit-payment-gateway-container']}>
      <div className={styles['page-header']}>
        <h1 className={styles['page-title']}>
          Edit Payment Gateway
        </h1>
      </div>
      
      <div className={styles['form-card']}>
        <form onSubmit={handleSubmit} className={styles['payment-gateway-form']}>
          {/* Payment Gateway Name */}
          <div className={styles['form-group']}>
            <label htmlFor="gatewayName" className={styles['form-label']}>
              Payment Gateway Name
            </label>
            <InputField
              id="gatewayName"
              type="text"
              placeholder="Enter payment gateway name"
              value={formData.gatewayName}
              onChange={(e) => handleInputChange('gatewayName', e.target.value)}
              required
            />
          </div>

          {/* Payment Gateway Subtitle */}
          <div className={styles['form-group']}>
            <label htmlFor="gatewaySubtitle" className={styles['form-label']}>
              Payment Gateway Subtitle
            </label>
            <InputField
              id="gatewaySubtitle"
              type="text"
              placeholder="Enter payment gateway subtitle"
              value={formData.gatewaySubtitle}
              onChange={(e) => handleInputChange('gatewaySubtitle', e.target.value)}
              required
            />
          </div>

          {/* Gateway Image Upload */}
          <div className={styles['form-group']}>
            <label className={styles['form-label']}>
              Gateway Image
            </label>
            <FileInputWithPreview
              onFileSelect={handleImageChange}
              accept="image/*"
            />
          </div>

          {/* Payment Gateway Attributes */}
          <div className={styles['form-group']}>
            <label className={styles['form-label']}>
              Payment Gateway Attributes
            </label>
            <div className={styles['tag-input-container']}>
              <div className={styles['tag-input-wrapper']}>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Enter attribute and press Enter or click +"
                  className={styles['tag-input']}
                />
                <button 
                  type="button" 
                  onClick={handleAddTag}
                  className={styles['add-tag-button']}
                >
                  +
                </button>
              </div>
              
              <div className={styles['tags-container']}>
                {formData.attributes.map((tag, index) => (
                  <div key={index} className={styles['tag-item']}>
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className={styles['remove-tag-button']}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Gateway Status */}
          <div className={styles['form-group']}>
            <label htmlFor="status" className={styles['form-label']}>
              Payment Gateway Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className={styles['form-select']}
            >
              <option value="Publish">Publish</option>
              <option value="Unpublish">Unpublish</option>
            </select>
          </div>

          {/* Show On Wallet */}
          <div className={styles['form-group']}>
            <label htmlFor="showOnWallet" className={styles['form-label']}>
              Show On Wallet?
            </label>
            <select
              id="showOnWallet"
              value={formData.showOnWallet}
              onChange={(e) => handleInputChange('showOnWallet', e.target.value)}
              className={styles['form-select']}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* Form Actions */}
          <div className={styles['form-actions']}>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              className={styles['cancel-button']}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              className={styles['update-button']}
            >
              Update Payment Gateway
            </Button>
          </div>
        </form>
      </div>
      <ToastContainerCustom />
    </div>
  );
};

export default EditPaymentGateway;