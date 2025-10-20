import { useEffect, useState } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userEmail: string;
  timestamp: Date;
  avatar?: string;
}

export function useMessages(teamId: string, channelId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId || !channelId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const messagesRef = collection(
        db,
        'teams',
        teamId,
        'channels',
        channelId,
        'messages'
      );
      const q = query(messagesRef, orderBy('timestamp', 'asc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const newMessages: Message[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            newMessages.push({
              id: doc.id,
              text: data.text,
              userId: data.userId,
              userName: data.userName,
              userEmail: data.userEmail,
              timestamp: data.timestamp?.toDate() || new Date(),
              avatar: data.avatar,
            });
          });
          setMessages(newMessages);
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching messages:', err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err: any) {
      console.error('Error setting up messages listener:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [teamId, channelId]);

  const sendMessage = async (
    text: string,
    userId: string,
    userName: string,
    userEmail: string,
    avatar?: string
  ) => {
    if (!text.trim() || !teamId || !channelId) return;

    try {
      const messagesRef = collection(
        db,
        'teams',
        teamId,
        'channels',
        channelId,
        'messages'
      );

      await addDoc(messagesRef, {
        text: text.trim(),
        userId,
        userName,
        userEmail,
        avatar: avatar || '',
        timestamp: serverTimestamp(),
      });
    } catch (err: any) {
      console.error('Error sending message:', err);
      throw err;
    }
  };

  return { messages, loading, error, sendMessage };
}
