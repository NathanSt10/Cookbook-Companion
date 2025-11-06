import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PantryItem } from '../../hooks/usePantry';
import { Ionicons } from '@expo/vector-icons';

interface ItemCardProps {
  item: PantryItem;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ItemCard({
  item,
  onPress,
  onEdit,
  onDelete,
}: ItemCardProps) {
  const isLowStock = item.quantity && parseFloat(item.quantity) > 0 && parseFloat(item.quantity) <= 2;
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const isExpiringSoon = (expiryDate?: string) => {
    return "need a system for this";
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.content}>
        <View style={styles.mainInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.category}>{item.category}</Text>
        </View>

        <View style={styles.details}>
          {item.quantity && (
            <View style={styles.detailItem}>
              <Text style={[
                styles.quantity,
                isLowStock && styles.lowStockText
              ]}>
                Qty: {item.quantity}
              </Text>
              {isLowStock && (
                <View style={styles.lowStockBadge}>
                  <Text style={styles.lowStockBadgeText}>Low</Text>
                </View>
              )}
            </View>
          )}
          
          {item.expiryDate && (
            <View style={[
              styles.expiryContainer,
              isExpiringSoon(item.expiryDate) && styles.expiringSoonContainer
            ]}>
              <Text style={[
                styles.expiryText,
                isExpiringSoon(item.expiryDate) && styles.expiringSoonText
              ]}>
                Expires: {formatDate(new Date(item.expiryDate))}
              </Text>
            </View>
          )}

          <Text style={styles.addedDate}>
            Added: {formatDate(item.addedAt)}
          </Text>
        </View>
      </View>
      
      {(onEdit || onDelete) && (
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity 
              onPress={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              style={styles.actionButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity 
              onPress={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              style={styles.actionButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={24} color="black" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'ghostwhite',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  mainInfo: {
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: 'royalblue',
    fontWeight: '500',
  },
  details: {
    gap: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantity: {
    fontSize: 14,
    color: 'tan',
  },
  lowStockText: {
    color: 'goldenrod',
    fontWeight: '600',
  },
  lowStockBadge: {
    backgroundColor: 'goldenrod',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  lowStockBadgeText: {
    color: 'ghostwhite',
    fontSize: 12,
    fontWeight: '600',
  },
  expiryContainer: {
    paddingVertical: 2,
  },
  expiringSoonContainer: {
    backgroundColor: 'goldenrod',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  expiryText: {
    fontSize: 14,
    color: 'black',
  },
  expiringSoonText: {
    color: 'firebrick',
    fontWeight: '600',
  },
  addedDate: {
    fontSize: 12,
    color: 'black',
  },
  actions: {
    flexDirection: 'column',
    gap: 8,
    marginLeft: 12,
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'black',
  },
});