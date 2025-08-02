import { NextFunction, Request, Response } from "express";
import Category from "../../models/Category";
import { availableIcons } from "../../data/icons";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.json(categories); 
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, icon } = req.body;
    if (!title || !icon) {
      res.status(400).json({ message: "Champs requis manquants" });
      return;
    }

    if (!availableIcons.includes(icon)) {
      res.status(400).json({ message: "Icône non valide" });
      return;
    }

    const newCategory = new Category({ title, icon });
    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (err) {
    next(err);
  }
};