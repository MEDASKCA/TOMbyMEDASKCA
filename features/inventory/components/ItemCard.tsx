'use client';

import React, { useState } from 'react';
import {
  Package,
  AlertTriangle,
  CheckCircle,
  Calendar,
  MapPin,
  Barcode,
  TrendingDown,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { InventoryItem } from '@/types';

interface ItemCardProps {
  item: InventoryItem;
  onSelect?: (item: InventoryItem) => void;
  selectable?: boolean;
}

export default function ItemCard({ item, onSelect, selectable = false }: ItemCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getCategoryColor = (category: InventoryItem['category']) => {
    switch (category) {
      case 'equipment':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          text: 'text-blue-700 dark:text-blue-400',
          border: 'border-blue-300 dark:border-blue-700',
        };
      case 'consumable':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-700 dark:text-green-400',
          border: 'border-green-300 dark:border-green-700',
        };
      case 'implant':
        return {
          bg: 'bg-purple-100 dark:bg-purple-900/30',
          text: 'text-purple-700 dark:text-purple-400',
          border: 'border-purple-300 dark:border-purple-700',
        };
      case 'drug':
        return {
          bg: 'bg-amber-100 dark:bg-amber-900/30',
          text: 'text-amber-700 dark:text-amber-400',
          border: 'border-amber-300 dark:border-amber-700',
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-700',
          text: 'text-gray-700 dark:text-gray-300',
          border: 'border-gray-300 dark:border-gray-600',
        };
    }
  };

  const categoryConfig = getCategoryColor(item.category);

  // Stock status
  const stockPercentage = (item.quantity / item.minQuantity) * 100;
  const stockStatus =
    item.quantity === 0
      ? { label: 'Out of Stock', color: 'red', icon: AlertTriangle }
      : stockPercentage <= 50
      ? { label: 'Low Stock', color: 'amber', icon: TrendingDown }
      : stockPercentage <= 100
      ? { label: 'Warning', color: 'yellow', icon: AlertTriangle }
      : { label: 'In Stock', color: 'green', icon: CheckCircle };

  // Expiry status
  const getExpiryStatus = () => {
    if (!item.expiryDate) return null;
    const today = new Date();
    const expiry = new Date(item.expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return { label: 'Expired', color: 'red', days: Math.abs(daysUntilExpiry) };
    } else if (daysUntilExpiry <= 30) {
      return { label: 'Expiring Soon', color: 'amber', days: daysUntilExpiry };
    } else if (daysUntilExpiry <= 90) {
      return { label: 'Check Expiry', color: 'yellow', days: daysUntilExpiry };
    }
    return { label: 'Valid', color: 'green', days: daysUntilExpiry };
  };

  const expiryStatus = getExpiryStatus();

  // Sterilization status
  const getSterilizationColor = (status?: InventoryItem['sterilizationStatus']) => {
    if (!status) return null;
    switch (status) {
      case 'sterile':
        return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Sterile' };
      case 'clean':
        return { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-700 dark:text-teal-400', label: 'Clean' };
      case 'in-process':
        return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', label: 'In Process' };
      case 'dirty':
        return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', label: 'Dirty' };
      case 'expired':
        return { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', label: 'Expired' };
      default:
        return null;
    }
  };

  const sterilizationConfig = getSterilizationColor(item.sterilizationStatus);

  return (
    <div
      className={`bg-white dark:bg-gray-800 border-2 ${
        item.quantity === 0
          ? 'border-red-300 dark:border-red-700'
          : stockPercentage <= 50
          ? 'border-amber-300 dark:border-amber-700'
          : 'border-gray-200 dark:border-gray-700'
      } rounded-lg overflow-hidden hover:shadow-lg transition-all ${selectable ? 'cursor-pointer' : ''}`}
      onClick={selectable ? () => onSelect?.(item) : undefined}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3 flex-1">
            <div className={`${categoryConfig.bg} border-2 ${categoryConfig.border} rounded-lg p-2.5`}>
              <Package className={`w-5 h-5 ${categoryConfig.text}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">{item.name}</h3>
              <div className="flex items-center flex-wrap gap-1.5">
                <span className={`text-xs font-medium ${categoryConfig.text} ${categoryConfig.bg} border ${categoryConfig.border} px-2 py-0.5 rounded-full`}>
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </span>
                {item.isCritical && (
                  <span className="text-xs font-medium text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 px-2 py-0.5 rounded-full">
                    Critical
                  </span>
                )}
                {sterilizationConfig && (
                  <span className={`text-xs font-medium ${sterilizationConfig.text} ${sterilizationConfig.bg} px-2 py-0.5 rounded-full`}>
                    {sterilizationConfig.label}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stock Level */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Stock Level</span>
            <div className="flex items-center space-x-1.5">
              <span
                className={`text-xs font-bold ${
                  stockStatus.color === 'red'
                    ? 'text-red-700 dark:text-red-400'
                    : stockStatus.color === 'amber'
                    ? 'text-amber-700 dark:text-amber-400'
                    : 'text-green-700 dark:text-green-400'
                }`}
              >
                {item.quantity} / {item.minQuantity} min
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all ${
                stockStatus.color === 'red'
                  ? 'bg-red-500'
                  : stockStatus.color === 'amber'
                  ? 'bg-amber-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
            />
          </div>

          <div className="flex items-center space-x-1.5 mt-1.5">
            {React.createElement(stockStatus.icon, {
              className: `w-4 h-4 ${
                stockStatus.color === 'red'
                  ? 'text-red-500'
                  : stockStatus.color === 'amber'
                  ? 'text-amber-500'
                  : 'text-green-500'
              }`,
            })}
            <span
              className={`text-xs font-medium ${
                stockStatus.color === 'red'
                  ? 'text-red-700 dark:text-red-400'
                  : stockStatus.color === 'amber'
                  ? 'text-amber-700 dark:text-amber-400'
                  : 'text-green-700 dark:text-green-400'
              }`}
            >
              {stockStatus.label}
            </span>
          </div>
        </div>

        {/* Manufacturer & Location */}
        <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400 mb-3">
          {item.manufacturer && (
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span className="text-xs">{item.manufacturer}</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span className="text-xs">{item.location}</span>
          </div>
        </div>

        {/* UDI */}
        {item.udi && (
          <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-2">
              <Barcode className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-xs font-mono text-gray-900 dark:text-white">{item.udi}</span>
            </div>
          </div>
        )}

        {/* Expiry Warning */}
        {expiryStatus && expiryStatus.color !== 'green' && (
          <div
            className={`mb-3 p-2 rounded border ${
              expiryStatus.color === 'red'
                ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                : 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Calendar className={`w-4 h-4 ${expiryStatus.color === 'red' ? 'text-red-600' : 'text-amber-600'}`} />
              <span
                className={`text-xs font-medium ${
                  expiryStatus.color === 'red'
                    ? 'text-red-700 dark:text-red-400'
                    : 'text-amber-700 dark:text-amber-400'
                }`}
              >
                {expiryStatus.label}: {expiryStatus.days} days {expiryStatus.days < 0 ? 'ago' : 'remaining'}
              </span>
            </div>
          </div>
        )}

        {/* Linked Procedures */}
        {item.linkedProcedures && item.linkedProcedures.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Used in {item.linkedProcedures.length} procedure(s)
            </p>
            <div className="flex items-center space-x-1">
              <ExternalLink className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Click to view details</span>
            </div>
          </div>
        )}

        {/* Expand Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="w-full flex items-center justify-center space-x-2 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors border-t border-gray-200 dark:border-gray-700 -mx-4 -mb-4 mt-3 px-4 pt-3"
        >
          <span>{expanded ? 'Hide Details' : 'Show Details'}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 space-y-3">
          {/* Full Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Category</p>
              <p className="text-sm text-gray-900 dark:text-white capitalize">{item.category}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Location</p>
              <p className="text-sm text-gray-900 dark:text-white">{item.location}</p>
            </div>
            {item.manufacturer && (
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Manufacturer</p>
                <p className="text-sm text-gray-900 dark:text-white">{item.manufacturer}</p>
              </div>
            )}
            {item.expiryDate && (
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Expiry Date</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {new Date(item.expiryDate).toLocaleDateString('en-GB')}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <button className="flex-1 px-3 py-2 bg-teal-500 hover:bg-teal-600 text-white text-xs font-medium rounded transition-colors">
              Request Restock
            </button>
            <button className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded transition-colors">
              View History
            </button>
            <button className="flex-1 px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white text-xs font-medium rounded transition-colors">
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
