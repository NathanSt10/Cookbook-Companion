import { useState } from 'react';
import { useAuth } from '../app/context/AuthContext';

export function useCalendar() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

}