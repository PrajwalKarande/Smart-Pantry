import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { usePantry } from '../context/PantryContext';
import { pantryApi, categoryApi } from '../services/api';
import PantryDashboard from '../components/pantry/PantryDashboard';
import AddItemForm from '../components/pantry/AddItemForm';
import UploadPantry from '../components/pantry/UploadPantry';
import LowStockBanner from '../components/pantry/LowStockBanner';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';

export default function PantryPage() {
  const {
    pantryItems, setPantryItems, addPantryItem, updatePantryItem,
    removePantryItem, setLoading, loading, showNotification
  } = usePantry();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // ─── Load items ───
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading({ pantry: true });
    try {
      const response = await pantryApi.getAll();
      setPantryItems(response.data);
    } catch (err) {
      showNotification('Failed to load pantry items', 'error');
    }
    setLoading({ pantry: false });
  };

  // ─── Add/Update Item ───
  const handleSubmitItem = async (formData) => {
    try {
      if (editItem) {
        const response = await pantryApi.update(editItem.id, formData);
        updatePantryItem(response.data);
        showNotification(`${formData.name} updated successfully!`);
      } else {
        const response = await pantryApi.add(formData);
        addPantryItem(response.data);
        showNotification(`${formData.name} added to pantry!`);
      }
      setShowAddModal(false);
      setEditItem(null);
    } catch (err) {
      showNotification('Failed to save item', 'error');
    }
  };

  // ─── Delete Item ───
  const handleDelete = async (id) => {
    try {
      await pantryApi.remove(id);
      removePantryItem(id);
      showNotification('Item removed from pantry');
    } catch (err) {
      showNotification('Failed to remove item', 'error');
    }
  };

  // ─── Edit Item ───
  const handleEdit = (item) => {
    setEditItem(item);
    setShowAddModal(true);
  };

  // ─── Upload text list ───
  const handleUploadText = async (text) => {
    setLoading({ upload: true });
    try {
      const response = await pantryApi.uploadTextList(text);
      const newItems = response.data;
      setPantryItems([...pantryItems, ...newItems]);
      showNotification(`${newItems.length} items added from text!`);
    } catch (err) {
      showNotification('Failed to parse text list', 'error');
    }
    setLoading({ upload: false });
  };

  // ─── Upload image ───
  const handleUploadImage = async (formData) => {
    setLoading({ upload: true });
    try {
      const response = await pantryApi.uploadImage(formData);
      const newItems = response.data;
      setPantryItems([...pantryItems, ...newItems]);
      showNotification(`${newItems.length} items identified from image!`);
    } catch (err) {
      showNotification('Failed to process image', 'error');
    }
    setLoading({ upload: false });
  };

  // ─── Auto-categorize ───
  const handleAutoCategorize = async (itemName) => {
    try {
      const response = await categoryApi.categorize(itemName);
      return response.data;
    } catch (err) {
      return null;
    }
  };

  if (loading.pantry) return <Loader text="Loading pantry..." />;

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {pantryItems.length} item{pantryItems.length !== 1 ? 's' : ''} in your pantry
          </p>
        </div>
        <button
          onClick={() => { setEditItem(null); setShowAddModal(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Alerts */}
      <LowStockBanner onDelete={handleDelete} onEdit={handleEdit} />

      {/* Upload Section */}
      <UploadPantry onUploadText={handleUploadText} onUploadImage={handleUploadImage} />

      {/* Pantry Grid */}
      <PantryDashboard items={pantryItems} onEdit={handleEdit} onDelete={handleDelete} />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setEditItem(null); }}
        title={editItem ? `Edit ${editItem.name}` : 'Add New Item'}
      >
        <AddItemForm
          onSubmit={handleSubmitItem}
          editItem={editItem}
          onCancel={() => { setShowAddModal(false); setEditItem(null); }}
          onAutoCategorizeFn={handleAutoCategorize}
        />
      </Modal>
    </div>
  );
}