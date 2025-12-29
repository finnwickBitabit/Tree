import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.get(api.trees.list.path, async (req, res) => {
    const trees = await storage.getTrees();
    res.json(trees);
  });

  app.post(api.trees.create.path, async (req, res) => {
    try {
      const input = api.trees.create.input.parse(req.body);
      const tree = await storage.createTree(input);
      res.status(201).json(tree);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.get(api.trees.get.path, async (req, res) => {
    const tree = await storage.getTree(Number(req.params.id));
    if (!tree) {
      return res.status(404).json({ message: 'Tree not found' });
    }
    res.json(tree);
  });

  app.delete(api.trees.delete.path, async (req, res) => {
    await storage.deleteTree(Number(req.params.id));
    res.status(204).send();
  });

  // Seed data
  const existing = await storage.getTrees();
  if (existing.length === 0) {
    await storage.createTree({
      commonName: "Coast Redwood",
      scientificName: "Sequoia sempervirens",
      location: "Muir Woods",
      height: 250,
      description: "A towering giant of the forest.",
      isFavorite: true
    });
    await storage.createTree({
      commonName: "Japanese Cherry",
      scientificName: "Prunus serrulata",
      location: "Botanical Garden",
      height: 15,
      description: "Beautiful pink blossoms in spring.",
      isFavorite: false
    });
    await storage.createTree({
      commonName: "Live Oak",
      scientificName: "Quercus virginiana",
      location: "Savannah Square",
      height: 60,
      description: "Iconic southern tree with sprawling branches.",
      isFavorite: true
    });
  }

  return httpServer;
}
