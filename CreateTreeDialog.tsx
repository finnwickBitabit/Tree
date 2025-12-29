import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTreeSchema, type InsertTree } from "@shared/schema";
import { useCreateTree } from "@/hooks/use-trees";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Leaf, Loader2 } from "lucide-react";
import { z } from "zod";

// Extend schema for form validation to coerce number strings
const formSchema = insertTreeSchema.extend({
  height: z.coerce.number().min(0, "Height must be a positive number"),
});

export function CreateTreeDialog() {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateTree();

  const form = useForm<InsertTree>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      commonName: "",
      scientificName: "",
      location: "",
      height: undefined,
      description: "",
      isFavorite: false,
    },
  });

  const onSubmit = (data: InsertTree) => {
    mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
          <Plus className="w-5 h-5 mr-2" />
          Plant New Tree
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-none shadow-2xl bg-card/95 backdrop-blur-sm">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-display text-primary-foreground/90 font-bold tracking-tight">
              Add a New Specimen
            </DialogTitle>
          </div>
          <DialogDescription>
            Record the details of a tree you've discovered or planted.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="commonName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Common Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Oak, Maple" {...field} className="rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="scientificName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scientific Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Quercus robur" {...field} value={field.value || ''} className="rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors italic" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Central Park, Backyard" {...field} className="rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Approx. Height (meters)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} value={field.value || ''} className="rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes & Observations</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the foliage, bark, or seasonal changes..." 
                      className="resize-none rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors min-h-[100px]" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl hover:bg-muted">
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="rounded-xl px-8 bg-primary hover:bg-primary/90 text-primary-foreground">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Planting...
                  </>
                ) : (
                  "Add Tree"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
