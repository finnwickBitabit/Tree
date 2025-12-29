import { useTrees } from "@/hooks/use-trees";
import { TreeCard } from "@/components/TreeCard";
import { CreateTreeDialog } from "@/components/CreateTreeDialog";
import { Loader2, Trees as TreesIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: trees, isLoading, error } = useTrees();
  const [search, setSearch] = useState("");

  const filteredTrees = trees?.filter(tree => 
    tree.commonName.toLowerCase().includes(search.toLowerCase()) || 
    tree.scientificName?.toLowerCase().includes(search.toLowerCase()) ||
    tree.location.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground font-medium animate-pulse">Growing your forest...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <TreesIcon className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Something went wrong</h2>
          <p className="text-muted-foreground">Failed to load your tree collection. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-green-200/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <main className="container-page relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="space-y-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/25">
                <TreesIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 tracking-tight">
                Arboretum
              </h1>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-lg"
            >
              A digital sanctuary for your botanical discoveries. Catalog, track, and admire the trees in your world.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <CreateTreeDialog />
          </motion.div>
        </div>

        <div className="mb-8 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Search by name, species, or location..." 
            className="pl-10 h-12 rounded-2xl bg-white/50 border-white/20 shadow-sm backdrop-blur-sm focus:bg-white transition-all duration-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filteredTrees && filteredTrees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredTrees.map((tree, index) => (
              <TreeCard key={tree.id} tree={tree} index={index} />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-border/60 rounded-3xl bg-white/30"
          >
            <div className="bg-muted/50 p-6 rounded-full mb-6">
              <Sprout className="w-12 h-12 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No trees found</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              {search ? "No matches found for your search term." : "Your forest is empty. Start planting today!"}
            </p>
            {!search && <CreateTreeDialog />}
          </motion.div>
        )}
      </main>
    </div>
  );
}
