import { z, defineCollection } from "astro:content";

// file loader reads JSON data from src/data/*.json
import { file } from "astro/loaders";

const plates = defineCollection({
	loader: file("src/data/plates.json"),
	schema: () =>
		z.object({
			id: z.number(),
			slug: z.string(),
			prettyName: z.string(),
			description: z.string().optional(),
			plates: z.array(
				z.object({
					name: z.string(),
					description: z.string().optional(),
					price: z.number().nullable().optional(),
					small: z.number().nullable().optional(),
					medium: z.number().nullable().optional(),
					large: z.number().nullable().optional(),
					family: z.number().nullable().optional(),
					options: z.array(z.string()).optional(),
					// image: image().optional(),
				})
			),
		}),
});

const reviews = defineCollection({
	loader: file("src/data/reviews.json"),
	schema: z.object({
		author: z.string(),
		review: z.string(),
	}),
});

const gallery = defineCollection({
	loader: file("src/data/gallery.json"),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			alt: z.string(),
			image: image(),
		}),
});

//collections object, makes collections queryable within your Astro pages and components
export const collections = { plates, reviews, gallery };
