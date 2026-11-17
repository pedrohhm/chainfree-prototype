import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getPatientSession, logInPatient, logOutPatient, type PatientAccount } from '../api/patientAuth';

export type UserType = 'patient' | 'therapist' | null;

export interface Compulsion {
  id: string;
  type: string;
  description: string;
  intensity: number; // 0-10
  createdAt: Date;
}

export interface Obsession {
  id: string;
  type: string;
  description: string;
  intensity: number; // 0-10
  createdAt: Date;
}

export interface SuccessRecord {
  date: Date;
  successRate: number;
  attempts?: { succeeded: number; total: number };
}

export interface EPRExercise {
  id: string;
  title: string;
  description: string;
  compulsionIds: string[]; // múltiplas compulsões
  isActive: boolean;
  anxietyLevel: number; // 0-10
  successChance: number; // 0-100%
  duration: number;
  successRecords: SuccessRecord[]; // múltiplos registros de sucesso
  successRate: number | null; // média dos registros (0-100)
  successAttempts: { succeeded: number; total: number } | null; // soma total
}

export interface Question {
  id: string;
  patientId: string;
  question: string;
  answer: string | null;
  createdAt: Date;
}

export interface ProgressEntry {
  date: Date;
  score: number;
}

interface AppContextType {
  userType: UserType;
  patient: PatientAccount | null;
  isRestoringSession: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  enterGuestMode: (type: NonNullable<UserType>) => void;
  userName: string;
  setUserName: (name: string) => void;
  obsessions: Obsession[];
  addObsession: (obsession: Omit<Obsession, 'id' | 'createdAt'>) => void;
  updateObsession: (id: string, updates: Partial<Obsession>) => void;
  deleteObsession: (id: string) => void;
  compulsions: Compulsion[];
  addCompulsion: (compulsion: Omit<Compulsion, 'id' | 'createdAt'>) => void;
  updateCompulsion: (id: string, updates: Partial<Compulsion>) => void;
  deleteCompulsion: (id: string) => void;
  eprExercises: EPRExercise[];
  addEPRExercise: (exercise: Omit<EPRExercise, 'id'>) => void;
  updateEPRExercise: (id: string, updates: Partial<EPRExercise>) => void;
  deleteEPRExercise: (id: string) => void;
  questions: Question[];
  addQuestion: (question: Omit<Question, 'id' | 'createdAt'>) => void;
  updateQuestion: (id: string, question: string) => void;
  deleteQuestion: (id: string) => void;
  answerQuestion: (id: string, answer: string) => void;
  progressData: ProgressEntry[];
  addProgressEntry: (entry: ProgressEntry) => void;
  ybocScore: number | null;
  setYbocScore: (score: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patient, setPatient] = useState<PatientAccount | null>(null);
  const [guestType, setGuestType] = useState<UserType>(null);
  const [guestName, setUserName] = useState('Visitante');
  const [isRestoringSession, setIsRestoringSession] = useState(true);
  const [obsessions, setObsessions] = useState<Obsession[]>([]);
  const [compulsions, setCompulsions] = useState<Compulsion[]>([]);
  const [eprExercises, setEPRExercises] = useState<EPRExercise[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [progressData, setProgressData] = useState<ProgressEntry[]>([]);
  const [ybocScore, setYbocScore] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getPatientSession(controller.signal)
      .then((patient) => {
        if (!controller.signal.aborted) setPatient(patient);
      })
      .catch(() => {
        if (!controller.signal.aborted) setPatient(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsRestoringSession(false);
      });
    return () => controller.abort();
  }, []);

  const clearPrototypeData = () => {
    setObsessions([]);
    setCompulsions([]);
    setEPRExercises([]);
    setQuestions([]);
    setProgressData([]);
    setYbocScore(null);
  };

  const signIn = async (email: string, password: string) => {
    const account = await logInPatient({ email, password });
    clearPrototypeData();
    setGuestType(null);
    setPatient(account);
  };

  const signOut = async () => {
    if (patient) await logOutPatient();
    clearPrototypeData();
    setPatient(null);
    setGuestType(null);
  };

  const enterGuestMode = (type: NonNullable<UserType>) => {
    clearPrototypeData();
    setUserName('Visitante');
    setGuestType(type);
  };

  const userType = patient ? 'patient' : guestType;
  const userName = patient?.name ?? (guestType ? guestName : '');

  const addObsession = (obsession: Omit<Obsession, 'id' | 'createdAt'>) => {
    setObsessions([...obsessions, { ...obsession, id: Date.now().toString(), createdAt: new Date() }]);
  };

  const updateObsession = (id: string, updates: Partial<Obsession>) => {
    setObsessions(obsessions.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  };

  const deleteObsession = (id: string) => {
    setObsessions(obsessions.filter((o) => o.id !== id));
  };

  const addCompulsion = (compulsion: Omit<Compulsion, 'id' | 'createdAt'>) => {
    const newCompulsion: Compulsion = {
      ...compulsion,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setCompulsions([...compulsions, newCompulsion]);
  };

  const updateCompulsion = (id: string, updates: Partial<Compulsion>) => {
    setCompulsions(
      compulsions.map((compulsion) =>
        compulsion.id === id ? { ...compulsion, ...updates } : compulsion
      )
    );
  };

  const deleteCompulsion = (id: string) => {
    setCompulsions(compulsions.filter((c) => c.id !== id));
  };

  const addEPRExercise = (exercise: Omit<EPRExercise, 'id'>) => {
    const newExercise: EPRExercise = {
      ...exercise,
      id: Date.now().toString(),
    };
    setEPRExercises([...eprExercises, newExercise]);
  };

  const updateEPRExercise = (id: string, updates: Partial<EPRExercise>) => {
    setEPRExercises(
      eprExercises.map((exercise) =>
        exercise.id === id ? { ...exercise, ...updates } : exercise
      )
    );
  };

  const deleteEPRExercise = (id: string) => {
    setEPRExercises(eprExercises.filter((e) => e.id !== id));
  };

  const addQuestion = (question: Omit<Question, 'id' | 'createdAt'>) => {
    const newQuestion: Question = {
      ...question,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, question: string) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, question } : q))
    );
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const answerQuestion = (id: string, answer: string) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, answer } : q))
    );
  };

  const addProgressEntry = (entry: ProgressEntry) => {
    setProgressData([...progressData, entry]);
  };

  return (
    <AppContext.Provider
      value={{
        userType,
        patient,
        isRestoringSession,
        signIn,
        signOut,
        enterGuestMode,
        userName,
        setUserName,
        obsessions,
        addObsession,
        updateObsession,
        deleteObsession,
        compulsions,
        addCompulsion,
        updateCompulsion,
        deleteCompulsion,
        eprExercises,
        addEPRExercise,
        updateEPRExercise,
        deleteEPRExercise,
        questions,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        answerQuestion,
        progressData,
        addProgressEntry,
        ybocScore,
        setYbocScore,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
