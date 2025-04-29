'use client';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronRight, X, Trash2 } from 'lucide-react';
import { useFiles, useActiveFileId, useSetActiveFile, useDeleteFile } from '@/lib/fileStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function FileSidebar() {
  const files = useFiles();
  const activeFileId = useActiveFileId();
  const setActiveFile = useSetActiveFile();
  const deleteFile = useDeleteFile();
  const [open, setOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setFileToDelete(id);
    setOpen(true);
  };

  const confirmDelete = async () => {
    if (fileToDelete) {
      await deleteFile(fileToDelete);
      setOpen(false);
      setFileToDelete(null);
    }
  };

  return (
    <TooltipProvider>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed left-4 top-4 z-50"
            aria-label="Open file list"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <header className="flex items-center justify-between px-4 py-2">
            <SheetTitle>Recent Files</SheetTitle>
            <SheetClose asChild>
              {/* <Button variant="ghost" size="icon" aria-label="Close file list">
                
              </Button> */}
            </SheetClose>
          </header>
          <ScrollArea className="h-[calc(100%-3rem)] px-2">
            {files.length === 0 ? (
              <p className="text-gray-500 px-2">No files yet</p>
            ) : (
              <ul className="space-y-2">
                {files.map((f) => (
                  <li key={f.id} className="flex items-center gap-2 px-2">
                    <Button
                      onClick={() => setActiveFile(f.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setActiveFile(f.id);
                        }
                      }}
                      variant={f.id === activeFileId ? 'default' : 'ghost'}
                      className="flex-1 truncate text-left"
                      aria-label={`Select ${f.name}`}
                    >
                      {f.name}
                    </Button>
                    <AlertDialog open={open} onOpenChange={setOpen}>
                      <AlertDialogTrigger asChild>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDelete(f.id)}
                              aria-label={`Delete ${f.name}`}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete {f.name}</TooltipContent>
                        </Tooltip>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete {f.name}. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}