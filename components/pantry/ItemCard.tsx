import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatQuantityWithUnit } from '../../constants/pantryUnits';
import { PantryItem } from '../../hooks/usePantry';
import { capitalizeFirstLetter } from '../../utils/CapitalizeFirstLetter';
import { getItemAge, getItemStatus, getStatusBadgeText, getStatusColor } from '../../utils/PantryAgeUtils';

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
  
  const getNumericQuantity = () => {
    if (!item.quantity) { return null; }

    const qty = typeof item.quantity === 'string'
      ? parseFloat(item.quantity)
      : item.quantity;
    return isNaN(qty) ? null : qty;
  };
  const numericQty = getNumericQuantity();
  const isLowStock = numericQty !== null && numericQty > 0 && numericQty <= 2;

  const itemAge = getItemAge(item.addedAt);
  const itemStatus = getItemStatus(item.addedAt);
  const statusBadgeText = getStatusBadgeText(itemStatus);
  const statusColor = getStatusColor(itemStatus);

  const formatDate = (date: Date) => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const day = date.getUTCDate();
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    return `${month} ${day}, ${year}`;
  };

  const renderPrimaryInfo = () => {
    return (
      <View style={styles.mainInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{capitalizeFirstLetter(item.name)}</Text>
          
          {isLowStock && (
            <View style={styles.lowStockBadge}>
              <Text style={styles.badgeText}>Low</Text>
            </View>
          )}
          
          {statusBadgeText && (
            <View style={[styles.ageBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.badgeText}>{statusBadgeText}</Text>
            </View>
          )}
        </View>

        <Text style={styles.category}>
          {Array.isArray(item.category)
            ? item.category.map(cat => capitalizeFirstLetter(cat)).join(', ')
            : capitalizeFirstLetter(item.category)
          }
        </Text>
      </View>
    );
  };

  const hasQuantity = 
    item.quantity !== undefined &&
    item.quantity !== null &&
    item.quantity !== '';
    
  const renderSecondaryInfo = () => {
    return (
      <View style={styles.details}>
        {hasQuantity && (
          <Text style={styles.detailText}>
            Qty: {formatQuantityWithUnit(item.quantity, item.unit)}
          </Text>
        )}

        <Text style={styles.detailText}>
          Pantry Age: {itemAge} {itemAge === 1 ? 'day' : 'days'}
        </Text>
      </View>
    );
  };

  const renderClickableActions = () => {
    if (!onEdit && !onDelete) { return null; }

    return (
      <View style={styles.actions}> 
        {onEdit && (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            style={styles.actionButton}
          >
            <Ionicons name='pencil' size={20} color='royalblue' />
          </TouchableOpacity>
        )}
        
        {onDelete && (
          <TouchableOpacity
            onPress={() => {
              onDelete();
            }}
            style={styles.actionButton}
          >
            <Ionicons name='close-circle' size={24} color='black' />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.content}>
        {renderPrimaryInfo()}
        {renderSecondaryInfo()}
      </View>
      
      {renderClickableActions()}
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
  lowStockBadge: {
    backgroundColor: 'goldenrod',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  ageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  category: {
    fontSize: 14,
    color: 'royalblue',
    fontWeight: '500',
  },
  details: {
    gap: 4,
  },
  detailText: {
    fontSize: 14,
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
});