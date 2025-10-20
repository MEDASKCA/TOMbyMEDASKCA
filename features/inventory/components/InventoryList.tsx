'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { InventoryItem } from '@/types';
import ItemCard from './ItemCard';
import {
  Search,
  Filter,
  Package,
  AlertTriangle,
  TrendingDown,
  CheckCircle,
  Download,
  RefreshCw,
  Plus,
  Barcode,
} from 'lucide-react';

export default function InventoryList() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [showExpiringOnly, setShowExpiringOnly] = useState(false);

  // Real-time inventory updates
  useEffect(() => {
    const inventoryRef = collection(db, 'inventory');
    const unsubscribe = onSnapshot(inventoryRef, (snapshot) => {
      const inventoryData: InventoryItem[] = [];
      snapshot.forEach((doc) => {
        inventoryData.push({ id: doc.id, ...doc.data() } as InventoryItem);
      });
      inventoryData.sort((a, b) => a.name.localeCompare(b.name));
      setInventory(inventoryData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Get unique values for filters
  const categories = useMemo(() => {
    const uniqueCategories = new Set(inventory.map((item) => item.category));
    return Array.from(uniqueCategories).sort();
  }, [inventory]);

  const locations = useMemo(() => {
    const uniqueLocations = new Set(inventory.map((item) => item.location));
    return Array.from(uniqueLocations).sort();
  }, [inventory]);

  // Check if item is expiring soon (within 90 days)
  const isExpiringSoon = (item: InventoryItem) => {
    if (!item.expiryDate) return false;
    const today = new Date();
    const expiry = new Date(item.expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 90;
  };

  // Filter and search inventory (FAST < 100ms target)
  const filteredInventory = useMemo(() => {
    const startTime = performance.now();

    const filtered = inventory.filter((item) => {
      // Search filter - optimized for speed
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
          item.name.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower) ||
          (item.manufacturer && item.manufacturer.toLowerCase().includes(searchLower)) ||
          (item.udi && item.udi.toLowerCase().includes(searchLower)) ||
          item.location.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

      // Location filter
      if (selectedLocation !== 'all' && item.location !== selectedLocation) return false;

      // Critical filter
      if (showCriticalOnly && !item.isCritical) return false;

      // Low stock filter
      if (showLowStockOnly) {
        const stockPercentage = (item.quantity / item.minQuantity) * 100;
        if (stockPercentage > 50) return false;
      }

      // Expiring filter
      if (showExpiringOnly && !isExpiringSoon(item)) return false;

      return true;
    });

    const endTime = performance.now();
    const searchTime = endTime - startTime;
    if (searchTime > 100) {
      console.warn(`Search took ${searchTime.toFixed(2)}ms - optimization needed`);
    }

    return filtered;
  }, [inventory, searchQuery, selectedCategory, selectedLocation, showCriticalOnly, showLowStockOnly, showExpiringOnly]);

  // Calculate stats
  const stats = useMemo(() => {
    const outOfStock = inventory.filter((item) => item.quantity === 0).length;
    const lowStock = inventory.filter((item) => {
      const stockPercentage = (item.quantity / item.minQuantity) * 100;
      return stockPercentage <= 50 && item.quantity > 0;
    }).length;
    const critical = inventory.filter((item) => item.isCritical).length;
    const expiringSoon = inventory.filter((item) => isExpiringSoon(item)).length;

    return {
      total: inventory.length,
      outOfStock,
      lowStock,
      critical,
      expiringSoon,
    };
  }, [inventory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Track equipment, consumables, and supplies with UDI support
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              title="Export inventory (Coming soon)"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              className="flex items-center space-x-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
              title="Scan UDI barcode (Coming soon)"
            >
              <Barcode className="w-4 h-4" />
              <span>Scan UDI</span>
            </button>
            <button
              className="flex items-center space-x-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
              title="Add new item (Coming soon)"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Items</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
              </div>
              <Package className="w-10 h-10 text-gray-400" />
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 dark:text-red-400">Out of Stock</p>
                <p className="text-3xl font-bold text-red-900 dark:text-red-300 mt-1">{stats.outOfStock}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-700 dark:text-amber-400">Low Stock</p>
                <p className="text-3xl font-bold text-amber-900 dark:text-amber-300 mt-1">{stats.lowStock}</p>
              </div>
              <TrendingDown className="w-10 h-10 text-amber-600 dark:text-amber-400" />
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 dark:text-purple-400">Critical Items</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-300 mt-1">{stats.critical}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 dark:text-orange-400">Expiring Soon</p>
                <p className="text-3xl font-bold text-orange-900 dark:text-orange-300 mt-1">{stats.expiringSoon}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-12 gap-3">
          {/* Search */}
          <div className="col-span-5 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, category, manufacturer, UDI, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              autoFocus
            />
          </div>

          {/* Category Filter */}
          <div className="col-span-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div className="col-span-2">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Filters */}
          <div className="col-span-3 flex items-center space-x-2">
            <label className="flex items-center space-x-1.5 cursor-pointer text-xs whitespace-nowrap">
              <input
                type="checkbox"
                checked={showCriticalOnly}
                onChange={(e) => setShowCriticalOnly(e.target.checked)}
                className="w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-gray-700 dark:text-gray-300">Critical</span>
            </label>
            <label className="flex items-center space-x-1.5 cursor-pointer text-xs whitespace-nowrap">
              <input
                type="checkbox"
                checked={showLowStockOnly}
                onChange={(e) => setShowLowStockOnly(e.target.checked)}
                className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
              />
              <span className="text-gray-700 dark:text-gray-300">Low Stock</span>
            </label>
            <label className="flex items-center space-x-1.5 cursor-pointer text-xs whitespace-nowrap">
              <input
                type="checkbox"
                checked={showExpiringOnly}
                onChange={(e) => setShowExpiringOnly(e.target.checked)}
                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="text-gray-700 dark:text-gray-300">Expiring</span>
            </label>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>
            Showing {filteredInventory.length} of {inventory.length} items
          </span>
          {(searchQuery ||
            selectedCategory !== 'all' ||
            selectedLocation !== 'all' ||
            showCriticalOnly ||
            showLowStockOnly ||
            showExpiringOnly) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedLocation('all');
                setShowCriticalOnly(false);
                setShowLowStockOnly(false);
                setShowExpiringOnly(false);
              }}
              className="text-teal-600 dark:text-teal-400 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredInventory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Filter className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Items Found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filters to find inventory items.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {filteredInventory.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
