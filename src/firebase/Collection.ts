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

interface NodeModel extends DataMeta {
  name: string | null;
  file: File | null;
}

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
}

class NotAuthenticatedError extends Error {
  constructor() {
    super("User is not authenticated");
    this.name = "NotAuthenticatedError";
  }
}

async function createNode(
  name: string | null = null,
  file: File | null = null
) {
  if (!auth.currentUser) throw new NotAuthenticatedError();
  const newNode: NodeModel = {
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

  const docRef = await addDoc(collection(firestore, Collection.notes), newNode);
  return docRef;
}
/**
 * Marks a node as deleted by setting the isDeleted field to true.
 * @param nodeId - The ID of the node to mark as deleted.
 * @returns Promise<void>
 */
async function deleteNode(nodeId: string): Promise<void> {
  await updateNode(nodeId, { deletedAt: serverTimestamp(), isDeleted: true });
}
async function getNode(id: string) {
  const docSnap = await getDoc(doc(firestore, Collection.notes, id));
  return docSnap;
}
/**
 * Updates the name of a specified node
 * @param nodeId - The ID of the node to update
 * @param data - the data to update
 * @returns Promise<void>
 */
async function updateNode(nodeId: string, data: object): Promise<void> {
  // Get a reference to the node document
  const nodeDocRef = doc(firestore, Collection.notes, nodeId);

  const updateData = {
    ...data,
    updatedAt: serverTimestamp(), // Set updatedAt to the current server timestamp
  };
  // Update the name field in the document
  await updateDoc(nodeDocRef, updateData);

  console.log(`Node ${nodeId} updated`);
}

export async function createEmptyNote() {
  const node = await createNode(null, {
    content: null,
    type: FileType.collabNote,
  });
  return node;
}
export async function getNote(id: string) {
  const node = await getNode(id);
  return node;
}
export async function deleteNote(id: string) {
  const node = await deleteNode(id);
  return node;
}
export async function updateNoteTitle(noteId: string, title: string) {
  await updateNode(noteId, { name: title });
}
export async function updateNoteFile(noteId: string, content: string) {
  const file = {
    content,
    type: FileType.note,
  };
  await updateNode(noteId, { file });
}
export async function updateCollabNoteFile(noteId: string, content: string) {
  const file = {
    content,
    type: FileType.collabNote,
  };
  await updateNode(noteId, { file });
}

export function onMyFilesystemChange(
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
