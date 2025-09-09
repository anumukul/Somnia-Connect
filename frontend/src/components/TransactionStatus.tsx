import React from 'react';

interface TransactionStatusProps {
  status: 'pending' | 'success' | 'error' | null;
  message?: string;
  txHash?: string;
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({ status, message, txHash }) => {
  if (!status) return null;

  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          bgColor: 'bg-blue-50 border-blue-200',
          textColor: 'text-blue-800',
          icon: '⏳'
        };
      case 'success':
        return {
          bgColor: 'bg-green-50 border-green-200',
          textColor: 'text-green-800',
          icon: '✅'
        };
      case 'error':
        return {
          bgColor: 'bg-red-50 border-red-200',
          textColor: 'text-red-800',
          icon: '❌'
        };
      default:
        return {
          bgColor: 'bg-gray-50 border-gray-200',
          textColor: 'text-gray-800',
          icon: 'ℹ️'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`p-4 border rounded-lg ${config.bgColor}`}>
      <div className={`flex items-center ${config.textColor}`}>
        <span className="mr-2">{config.icon}</span>
        <span className="font-medium">{message}</span>
      </div>
      {txHash && (
        <div className="mt-2">
          <a 
            href={`https://shannon-explorer.somnia.network/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm underline"
          >
            View on Explorer
          </a>
        </div>
      )}
    </div>
  );
};

export default TransactionStatus;