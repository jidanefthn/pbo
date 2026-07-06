import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { movies } from "../db/schema/movies";

export const getMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const allMovies = await db.select().from(movies);
    res.status(200).json({
      success: true,
      total: allMovies.length,
      movies: allMovies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch movies",
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const getMovieById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const movieId = Number(req.params.id);
    const movie = await db.select().from(movies).where(eq(movies.id, movieId));

    if (movie.length === 0) {
      res.status(404).json({
        success: false,
        message: "Movie not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      movie: movie[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch movie",
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const createMovie = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // 🌟 PERBAIKAN 1: Tambahkan price di destructuring
    const { title, genre, duration, description, posterUrl, price } = req.body;

    if (!title || !genre || !duration) {
      res.status(400).json({
        success: false,
        message: "Title, genre, and duration are required",
      });
      return;
    }

    const newMovie = await db
      .insert(movies)
      .values({
        title,
        genre,
        duration,
        description,
        posterUrl,
        // Pastikan formatnya angka, jika kosong jadikan 0
        price: Number(price) || 0, 
      })
      .returning();

    res.status(201).json({
      success: true,
      message: "Movie created successfully",
      movie: newMovie[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create movie",
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const updateMovie = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const movieId = Number(req.params.id);
    
    // 🌟 PERBAIKAN 2: Tambahkan price di destructuring
    const { title, genre, duration, description, posterUrl, price } = req.body;

    const existingMovie = await db
      .select()
      .from(movies)
      .where(eq(movies.id, movieId));

    if (existingMovie.length === 0) {
      res.status(404).json({
        success: false,
        message: "Movie not found",
      });
      return;
    }

    const updatedMovie = await db
      .update(movies)
      .set({
        title,
        genre,
        duration,
        description,
        posterUrl,
        // 🌟 PERBAIKAN 3: Masukkan price ke dalam operasi set
        price: Number(price) || 0, 
      })
      .where(eq(movies.id, movieId))
      .returning();

    res.status(200).json({
      success: true,
      message: "Movie updated successfully",
      movie: updatedMovie[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update movie",
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const deleteMovie = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const movieId = Number(req.params.id);

    const existingMovie = await db
      .select()
      .from(movies)
      .where(eq(movies.id, movieId));

    if (existingMovie.length === 0) {
      res.status(404).json({
        success: false,
        message: "Movie not found",
      });
      return;
    }

    await db.delete(movies).where(eq(movies.id, movieId));

    res.status(200).json({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete movie",
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};