import { ExamRow, PreGuiaData } from '../types';
import { PS_EXAM_DATA_ORIGINAL, AMOR_EXAM_DATA_ORIGINAL, LAB_EXAM_DATA_ORIGINAL } from '../data/examData';

const MASTER_HASH_KEY = 'hpmPopMasterHashV2';
const MASTER_SESSION_KEY = 'hpmPopMasterSessionV2';
const MASTER_DEFAULT_PASSWORD = 'HPM@2026';

export const SYSTEM_DEFAULT_USER = 'HPM';
export const SYSTEM_DEFAULT_PASSWORD = 'HPM@2026';
const SYSTEM_AUTH_KEY = 'hpmSystemAuthV1';

export function isSystemAuthenticated(): boolean {
  try {
    return (
      localStorage.getItem(SYSTEM_AUTH_KEY) === 'true' ||
      sessionStorage.getItem(SYSTEM_AUTH_KEY) === 'true'
    );
  } catch {
    return false;
  }
}

export function setSystemAuth(authenticated: boolean, remember: boolean = true): void {
  try {
    if (authenticated) {
      if (remember) {
        localStorage.setItem(SYSTEM_AUTH_KEY, 'true');
        sessionStorage.setItem(SYSTEM_AUTH_KEY, 'true');
      } else {
        sessionStorage.setItem(SYSTEM_AUTH_KEY, 'true');
        localStorage.removeItem(SYSTEM_AUTH_KEY);
      }
    } else {
      localStorage.removeItem(SYSTEM_AUTH_KEY);
      sessionStorage.removeItem(SYSTEM_AUTH_KEY);
    }
  } catch {
    // Ignore storage issues
  }
}

export function verifySystemCredentials(username: string, password: string): boolean {
  const normalizedUser = username.trim().toUpperCase();
  const normalizedPass = password.trim();
  return normalizedUser === SYSTEM_DEFAULT_USER && normalizedPass === SYSTEM_DEFAULT_PASSWORD;
}

const PS_STORAGE_KEY = 'hpmPsExamsStorageV3';
const AMOR_STORAGE_KEY = 'hpmAmorExamsStorageV3';
const LAB_STORAGE_KEY = 'hpmLabExamsStorageV3';
const PRE_GUIAS_KEY = 'hpmPreGuiasStorageV3';
const GLOBAL_EDITS_KEY = 'hpmGlobalMasterEditsV3';

export function simpleHash(v: string): string {
  let h = 2166136261;
  for (let i = 0; i < v.length; i++) {
    h ^= v.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}

export function getMasterHash(): string {
  try {
    const saved = localStorage.getItem(MASTER_HASH_KEY);
    if (saved) return saved;
    const initial = simpleHash(MASTER_DEFAULT_PASSWORD);
    localStorage.setItem(MASTER_HASH_KEY, initial);
    return initial;
  } catch {
    return simpleHash(MASTER_DEFAULT_PASSWORD);
  }
}

export function verifyMasterPassword(password: string): boolean {
  return simpleHash(password) === getMasterHash();
}

export function setMasterPassword(newPassword: string): boolean {
  try {
    const h = simpleHash(newPassword);
    localStorage.setItem(MASTER_HASH_KEY, h);
    return true;
  } catch {
    return false;
  }
}

export function isMasterLoggedIn(): boolean {
  try {
    return sessionStorage.getItem(MASTER_SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export function setMasterSession(loggedIn: boolean): void {
  try {
    if (loggedIn) {
      sessionStorage.setItem(MASTER_SESSION_KEY, '1');
    } else {
      sessionStorage.removeItem(MASTER_SESSION_KEY);
    }
  } catch {
    // Ignore storage issues
  }
}

function tupleToExamRow(r: [string, string, string, string, string]): ExamRow {
  return {
    code: r[0] || '',
    description: r[1] || '',
    particularPrice: r[2] || '*',
    medPrevPrice: r[3] || '*',
    pageRef: r[4] || ''
  };
}

export function loadPsExams(): ExamRow[] {
  try {
    const saved = localStorage.getItem(PS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return PS_EXAM_DATA_ORIGINAL.map(tupleToExamRow);
}

export function savePsExams(exams: ExamRow[]): boolean {
  try {
    localStorage.setItem(PS_STORAGE_KEY, JSON.stringify(exams));
    return true;
  } catch {
    return false;
  }
}

export function loadAmorExams(): ExamRow[] {
  try {
    const saved = localStorage.getItem(AMOR_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return AMOR_EXAM_DATA_ORIGINAL.map(tupleToExamRow);
}

export function saveAmorExams(exams: ExamRow[]): boolean {
  try {
    localStorage.setItem(AMOR_STORAGE_KEY, JSON.stringify(exams));
    return true;
  } catch {
    return false;
  }
}

export function loadLabExams(): ExamRow[] {
  try {
    const saved = localStorage.getItem(LAB_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return LAB_EXAM_DATA_ORIGINAL.map(tupleToExamRow);
}

export function saveLabExams(exams: ExamRow[]): boolean {
  try {
    localStorage.setItem(LAB_STORAGE_KEY, JSON.stringify(exams));
    return true;
  } catch {
    return false;
  }
}

export function resetExamsToDefault(table: 'ps' | 'amor' | 'lab'): ExamRow[] {
  if (table === 'ps') {
    const d = PS_EXAM_DATA_ORIGINAL.map(tupleToExamRow);
    savePsExams(d);
    return d;
  }
  if (table === 'amor') {
    const d = AMOR_EXAM_DATA_ORIGINAL.map(tupleToExamRow);
    saveAmorExams(d);
    return d;
  }
  const d = LAB_EXAM_DATA_ORIGINAL.map(tupleToExamRow);
  saveLabExams(d);
  return d;
}

export function loadPreGuias(): PreGuiaData[] {
  try {
    const s = localStorage.getItem(PRE_GUIAS_KEY);
    if (s) {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // fallback
  }
  return [];
}

export function savePreGuia(guia: PreGuiaData): PreGuiaData[] {
  const current = loadPreGuias();
  const existingIdx = current.findIndex(g => g.id === guia.id);
  let updated: PreGuiaData[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = guia;
  } else {
    updated = [guia, ...current];
  }
  try {
    localStorage.setItem(PRE_GUIAS_KEY, JSON.stringify(updated));
  } catch {
    // fallback
  }
  return updated;
}

export function deletePreGuia(id: string): PreGuiaData[] {
  const current = loadPreGuias().filter(g => g.id !== id);
  try {
    localStorage.setItem(PRE_GUIAS_KEY, JSON.stringify(current));
  } catch {
    // fallback
  }
  return current;
}

export function getGlobalMasterEdits(): Record<string, string> {
  try {
    const s = localStorage.getItem(GLOBAL_EDITS_KEY);
    return s ? JSON.parse(s) : {};
  } catch {
    return {};
  }
}

export function setGlobalMasterEdits(edits: Record<string, string>): boolean {
  try {
    localStorage.setItem(GLOBAL_EDITS_KEY, JSON.stringify(edits));
    return true;
  } catch {
    return false;
  }
}
