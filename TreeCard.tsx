import { type Tree } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Ruler, Trash2, Sprout } from "lucide-react";
import { useDeleteTree } from "@/hooks/use-trees";
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
} from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";

interface TreeCardProps {
  tree: Tree;
  index: number;
}

export function TreeCard({ tree, index }: TreeCardProps) {
  const { mutate: deleteTree, isPending: isDeleting } = useDeleteTree();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="group relative overflow-hidden rounded-2xl border-none shadow-md bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
        {/* Decorative Top Gradient */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary to-green-400 opacity-80" />

        <CardHeader className="pt-6 pb-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-display font-bold text-gray-900 group-hover:text-primary transition-colors">
                {tree.commonName}
              </h3>
              {tree.scientificName && (
                <p className="text-sm text-muted-foreground italic font-serif mt-1">
                  {tree.scientificName}
                </p>
              )}
            </div>
            <div className="p-2 bg-green-50 rounded-full text-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Sprout className="w-5 h-5" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-grow space-y-4 py-4">
          <div className="flex flex-col gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary/70" />
              <span>{tree.location}</span>
            </div>
            {tree.height && (
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-primary/70" />
                <span>{tree.height}m tall</span>
              </div>
            )}
          </div>
          
          {tree.description && (
            <p className="text-sm text-gray-500 line-clamp-3 mt-2 pl-3 border-l-2 border-green-100">
              {tree.description}
            </p>
          )}
        </CardContent>

        <CardFooter className="pt-2 pb-6 flex justify-end gap-2 border-t border-gray-50 mt-auto bg-gray-50/50">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove <span className="font-semibold text-foreground">{tree.commonName}</span> from your collection.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => deleteTree(tree.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                >
                  {isDeleting ? "Removing..." : "Yes, Remove Tree"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
