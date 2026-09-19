# Data Model — Stocktake Note
Types: StocktakeNoteStatus, StocktakeNote, StocktakeLine {material, difference, reason}, StocktakeNoteDetail, StocktakeLineInput {materialId, difference, reason}, StocktakeNoteInput {date, warehouseId, note, lines}, GetStocktakeNotesParams.
Schemas: StocktakeLineSchema (difference!=0, reason nonEmpty), StocktakeNoteSchema (ward), VoidNoteSchema.
Utils: status color map, toStocktakeNoteInput.
