import notes, { setNotes } from '../slices/notes';
import { resetApp } from '../slices/index';

describe('notes reducer', () => {
  it('should handle initial state', () => {
    expect(notes.reducer(undefined, { type: 'unknown' })).toEqual({});
  });

  it('should handle setNotes', () => {
    const note = { id: '1', title: 'Test Note', content: 'Test Content' };
    const actual = notes.reducer({}, setNotes(note));
    expect(actual).toEqual({ '1': note });
  });

  it('should handle updating existing note', () => {
    const initialState = {
      '1': { id: '1', title: 'Old Title', content: 'Old Content' }
    };
    const updatedNote = { id: '1', title: 'New Title', content: 'New Content' };
    const actual = notes.reducer(initialState, setNotes(updatedNote));
    expect(actual).toEqual({ '1': updatedNote });
  });

  it('should handle RESET_APP', () => {
    const initialState = {
      '1': { id: '1', title: 'Test Note', content: 'Test Content' }
    };
    const actual = notes.reducer(initialState, resetApp());
    expect(actual).toEqual({});
  });
});
