import notebook, { setNotebooks, setNotes } from '../slices/notebook';
import { resetApp } from '../slices/index';

describe('notebook reducer', () => {
  it('should handle initial state', () => {
    expect(notebook.reducer(undefined, { type: 'unknown' })).toEqual({
      notebooks: []
    });
  });

  it('should handle setNotebooks', () => {
    const notebooks = [
      { id: '1', name: 'Notebook 1', notes: [] },
      { id: '2', name: 'Notebook 2', notes: [] }
    ];
    const actual = notebook.reducer({ notebooks: [] }, setNotebooks(notebooks));
    expect(actual).toEqual({ notebooks });
  });

  it('should handle setNotes for specific notebook', () => {
    const initialState = {
      notebooks: [
        { id: '1', name: 'Notebook 1', notes: [] },
        { id: '2', name: 'Notebook 2', notes: [] }
      ]
    };
    const notes = [
      { id: 'note1', name: 'Note 1' },
      { id: 'note2', name: 'Note 2' }
    ];
    const actual = notebook.reducer(
      initialState,
      setNotes({ notebookId: '1', notes })
    );
    expect(actual.notebooks[0].notes).toEqual(notes);
    expect(actual.notebooks[1].notes).toEqual([]);
  });

  it('should not modify notebooks when setting notes for non-existent notebook', () => {
    const initialState = {
      notebooks: [
        { id: '1', name: 'Notebook 1', notes: [] }
      ]
    };
    const notes = [{ id: 'note1', name: 'Note 1' }];
    const actual = notebook.reducer(
      initialState,
      setNotes({ notebookId: 'non-existent', notes })
    );
    expect(actual).toEqual(initialState);
  });

  it('should handle RESET_APP', () => {
    const initialState = {
      notebooks: [
        { id: '1', name: 'Notebook 1', notes: [{ id: 'note1', name: 'Note 1' }] }
      ]
    };
    const actual = notebook.reducer(initialState, resetApp());
    expect(actual).toEqual({ notebooks: [] });
  });
});
