import {
  addDoc,
  collection,
  getDoc,
  doc,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  DocumentSnapshot,
  Timestamp,
  query,
  where,
  updateDoc,
  serverTimestamp,
  FieldValue,
} from "firebase/firestore";
import { auth, firestore } from ".";

interface DataMeta {
  createdAt: FieldValue;
  updatedAt: FieldValue;
  deletedAt: FieldValue;
  permission: Permission;
  isDeleted: boolean;
}

interface NoteModel extends DataMeta {
  name: string | null;
  file: File | null;
}

// interface NotebookModel extends DataMeta {
//   name: string | null;
//   notesIds: string[];
// }


interface Permission {
  admins: string[];
  editors?: string[]; // Optional if some fields may be missing
  viewers?: string[];
}
interface File {
  content: any;
  type: FileType;
}
export enum Collection {
  notes = "notes",
}
export enum FileType {
  note = "note",
  collabNote = "collabNote",
  quillNote = "quillNote",
}

class NotAuthenticatedError extends Error {
  constructor() {
    super("User is not authenticated");
    this.name = "NotAuthenticatedError";
  }
}

async function createNote(
  name: string | null = null,
  file: File | null = null
) {
  if (!auth.currentUser) throw new NotAuthenticatedError();
  const newNote: NoteModel = {
    name,
    file,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    deletedAt: serverTimestamp(),
    permission: {
      admins: [auth.currentUser.uid],
    },
    isDeleted: false,
  };

  const docRef = await addDoc(collection(firestore, Collection.notes), newNote);
  return docRef;
}
/**
 * Updates the name of a specified node
 * @param nodeId - The ID of the node to update
 * @param data - the data to update
 * @returns Promise<void>
 */
async function updateNote(noteId: string, data: object): Promise<void> {
  // Get a reference to the node document
  const noteDocRef = doc(firestore, Collection.notes, noteId);

  const updateData = {
    ...data,
    updatedAt: serverTimestamp(), // Set updatedAt to the current server timestamp
  };
  // Update the name field in the document
  await updateDoc(noteDocRef, updateData);

  console.log(`Note ${noteId} updated`);
}

export async function createEmptyNote() {
  const node = await createNote(null, {
    content: null,
    type: FileType.note,
  });
  return node;
}
export async function getNote(noteId: string) {
  return await getDoc(doc(firestore, Collection.notes, noteId));
}
export async function deleteNote(noteId: string) {
  await updateNote(noteId, { deletedAt: serverTimestamp(), isDeleted: true });
}
export async function updateNoteTitle(noteId: string, title: string) {
  await updateNote(noteId, { name: title });
}
export async function updateNoteFile(noteId: string, content: string) {
  const file = {
    content,
    type: FileType.note,
  };
  await updateNote(noteId, { file });
}

export function onMyNotesChange(
  callback: (snapshot: QuerySnapshot<DocumentData, DocumentData>) => void
) {
  if (!auth.currentUser) throw new NotAuthenticatedError();

  const q = query(
    collection(firestore, Collection.notes),
    where("permission.admins", "array-contains", auth.currentUser.uid),
    where("isDeleted", "==", false)
  );
  return onSnapshot(q, callback);
}

export function documentSnapshotToJSON(docSnap: DocumentSnapshot) {
  if (!docSnap.exists()) throw new Error("Document does not exist");
  type ResultType = { [key: string]: any };
  const data = docSnap.data();

  function convertTimestamps(obj: ResultType): ResultType {
    const result: ResultType = {};

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];

        if (value instanceof Timestamp) {
          result[key] = value.toDate().toISOString();
        } else if (
          value !== null &&
          typeof value === "object" &&
          !Array.isArray(value)
        ) {
          result[key] = convertTimestamps(value);
        } else {
          result[key] = value;
        }
      }
    }

    return result;
  }

  return { ...convertTimestamps(data), id: docSnap.id };
}
