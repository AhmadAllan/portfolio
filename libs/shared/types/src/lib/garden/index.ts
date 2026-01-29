import { NoteMaturity } from '../common';
import { ITag } from '../blog';

export interface INote {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  content: string;
  contentEn?: string;
  maturity: NoteMaturity;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  tags?: ITag[];
  outgoingLinks?: INoteLink[];
  backlinks?: INoteLink[];
}

export interface INoteLink {
  id: string;
  sourceNoteId: string;
  targetSlug: string;
  targetNoteId?: string;
  isBroken: boolean;
  createdAt: Date;
  // Relations
  sourceNote?: INote;
  targetNote?: INote;
}
