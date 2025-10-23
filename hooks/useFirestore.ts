import { useState, useEffect } from 'react';
import {
  collection,
  query,
  onSnapshot,
  Query,
  DocumentData,
  QueryConstraint,
  where,
  orderBy as firestoreOrderBy
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

/**
 * Custom hook for real-time Firestore data
 * @param collectionName - Firestore collection name
 * @param constraints - Optional query constraints (where, orderBy, limit, etc.)
 * @returns { data, loading, error }
 */
export function useFirestoreCollection<T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      const collectionRef = collection(db, collectionName);
      const q = constraints.length > 0
        ? query(collectionRef, ...constraints)
        : collectionRef;

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as T[];

          setData(items);
          setLoading(false);
        },
        (err) => {
          console.error(`Error fetching ${collectionName}:`, err);
          setError(err as Error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error(`Error setting up listener for ${collectionName}:`, err);
      setError(err as Error);
      setLoading(false);
    }
  }, [collectionName, JSON.stringify(constraints)]);

  return { data, loading, error };
}

/**
 * Hook for single document with real-time updates
 */
export function useFirestoreDoc<T = DocumentData>(
  collectionName: string,
  docId: string | null
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!docId) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const docRef = collection(db, collectionName);
      const q = query(docRef, where('__name__', '==', docId));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            setData({ id: doc.id, ...doc.data() } as T);
          } else {
            setData(null);
          }
          setLoading(false);
        },
        (err) => {
          console.error(`Error fetching document ${docId}:`, err);
          setError(err as Error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error(`Error setting up listener for document ${docId}:`, err);
      setError(err as Error);
      setLoading(false);
    }
  }, [collectionName, docId]);

  return { data, loading, error };
}
