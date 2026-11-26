import React, { useEffect, useState } from "react";

// Keep these React primitives: the completed migration owns local UI state and
// synchronizes the item collection through one effect.
void [useEffect, useState];

export default function ReadingQueue({ storage: _storage, initialItems: _initialItems, createItemId: _createItemId }) {
  return <main><h1>Reading queue</h1><p role="status">React migration not implemented.</p></main>;
}
