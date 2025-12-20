// src/components/ChangePasswordModal.jsx
import { useLanguage } from '../context/LanguageContext';
import './ChangePasswordModal.css';

// eslint-disable-next-line react/prop-types
function ChangePasswordModal({ onClose }) {
    const { t } = useLanguage();

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{t('changePasswordTitle')}</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="info-message">
                        ⚠️ {t('backendRequired')}
                    </div>

                    <div className="form-group">
                        <label>{t('currentPassword')}</label>
                        <input type="password" placeholder="••••••" disabled />
                    </div>

                    <div className="form-group">
                        <label>{t('newPassword')}</label>
                        <input type="password" placeholder="••••••" disabled />
                    </div>

                    <div className="form-group">
                        <label>{t('confirmPassword')}</label>
                        <input type="password" placeholder="••••••" disabled />
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>
                        {t('cancel')}
                    </button>
                    <button className="btn-save" disabled>
                        {t('save')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChangePasswordModal;
