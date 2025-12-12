import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PANTRY_UNITS, UNIT_CATEGORIES, UnitCategory } from '../constants/pantryUnits';

interface UnitSelectorProps {
    selectedUnit?: string;
    onSelectUnit: (unit: string) => void;
    disabled?: boolean;
    testID?: string;
}

export default function UnitSelector({ selectedUnit, onSelectUnit, disabled, testID }: UnitSelectorProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const [customUnit, setCustomUnit] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<UnitCategory | 'all'>('all');
    const [internalSelectedUnit, setInternalSelectedUnit] = useState<string | undefined>(selectedUnit);
    const effectiveSelectedUnit = selectedUnit ?? internalSelectedUnit;

    const handleSelectUnit = (unitValue: string) => {
      if (selectedUnit === undefined) {
        setInternalSelectedUnit(unitValue)
      }

      onSelectUnit(unitValue);
      setModalVisible(false);
    };

    const handleAddCustomUnit = () => {
        if (customUnit.trim()) {
            onSelectUnit(customUnit.trim());
            setCustomUnit('');
            setModalVisible(false);
        }
    };

    const getDisplayText = () => {
        if (!selectedUnit) { return 'Select unit'; }

        const predefinedUnit = PANTRY_UNITS.find(u => u.value === effectiveSelectedUnit);
        return predefinedUnit 
          ? predefinedUnit.abbreviation || predefinedUnit.value 
          : effectiveSelectedUnit; 
    };

    const filteredUnits = selectedCategory === 'all'
        ? PANTRY_UNITS
        : PANTRY_UNITS.filter(unit => unit.category === selectedCategory);

    return (
        <>
            <TouchableOpacity
                style={[styles.selector, disabled && styles.selectorDisabled]}
                onPress={() => !disabled && setModalVisible(true)}
                disabled={disabled}
                testID={testID}
                accessibilityState={{ disabled: !!disabled }}
            >
                <Text 
                    style={[styles.selectorText, !selectedUnit && styles.placeholderText]}
                    testID={testID ? `${testID}-text` : undefined}
                >
                    {getDisplayText()}
                </Text>
                    <Ionicons name="chevron-down" size={20} color='grey' />
            </TouchableOpacity>

            <Modal  
                visible={modalVisible}
                animationType='slide'
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Unit</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name='close' size={28} color='black' />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.categoryScroll}
                        >
                            <TouchableOpacity
                                style={[
                                    styles.categoryChip, 
                                    selectedCategory==='all' && styles.categoryChipSelected
                                ]}
                                onPress={() => setSelectedCategory('all')}
                            >
                                <Text style={[
                                    styles.categoryChipText,
                                    selectedCategory === 'all' && styles.categoryChipTextSelected
                                ]}>
                                    All
                                </Text>
                            </TouchableOpacity>

                            {UNIT_CATEGORIES.map((cat) => (
                                <TouchableOpacity
                                    key={cat.key}
                                    style={[
                                        styles.categoryChip,
                                        selectedCategory === cat.key && styles.categoryChipSelected
                                    ]}
                                    onPress={() => setSelectedCategory(cat.key as UnitCategory)}
                                >
                                    <Text style={[
                                        styles.categoryChipText,
                                        selectedCategory === cat.key && styles.categoryChipTextSelected
                                    ]}>
                                        {cat.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <ScrollView style={styles.unitsScroll}>
                            <Text style={styles.sectionTitle}>Common Units</Text>
                            <View style={styles.unitsGrid}>
                                {filteredUnits.map((unit) => (
                                    <TouchableOpacity
                                        key={unit.value}
                                        style={[
                                            styles.unitButton,
                                            effectiveSelectedUnit === unit.value && styles.unitButtonSelected
                                       ]}
                                       onPress={() => handleSelectUnit(unit.value)}
                                    >
                                        <Text style={[
                                            styles.unitButtonText,
                                            effectiveSelectedUnit === unit.value && styles.unitButtonTextSelected
                                        ]}>
                                            {unit.abbreviation || unit.value}
                                        </Text>
                                            <Text style={styles.unitButtonLabel}>{unit.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    selector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: 'gainsboro',
        minWidth: 120,
    },
    selectorDisabled: {
        backgroundColor: 'whitesmoke',
        opacity: 0.6,
    },
    selectorText: {
        fontSize: 16,
        color: 'black',
    },
    placeholderText: {
        color: 'grey',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'ghostwhite',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'gainsboro',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    categoryScroll: {
        padding: 16,
        paddingBottom: 8,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'whitesmoke',
        marginRight: 8,
    },
    categoryChipSelected: {
        backgroundColor: 'royalblue',
    },
    categoryChipText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
    },
    categoryChipTextSelected: {
        color: 'white',
    },
    customUnitSelection: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 8,
    },
    customUnitInput: {
        flexDirection: 'row',
        gap: 8,
    },
    customInput: {
        flex: 1,
        backgroundColor: 'whitesmoke',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'gainsboro',
    },
    addCustomButton: {
        backgroundColor: 'royalblue',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        justifyContent: 'center',
    },
    addCustomButtonDisabled: {
        backgroundColor: 'gainsboro',
    },
    addCustomButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    addCustomButtonTextDisabled: {
        color: 'grey',
    },
    unitsScroll: {
        paddingHorizontal: 16,
    },
    unitsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    unitButton: {
        backgroundColor: 'whitesmoke',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'gainsboro',
        minWidth: '30%',
        alignItems: 'center',
    },
    unitButtonSelected: {
        backgroundColor: 'aliceblue',
        borderColor: 'royalblue',
        borderWidth: 2,
    },
    unitButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 2,
    },
    unitButtonTextSelected: {
        color: 'royalblue',
    },
    unitButtonLabel: {
        fontSize: 11,
        color: 'grey',
        textAlign: 'center',
    },
});