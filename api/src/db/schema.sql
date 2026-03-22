CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE drops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_token TEXT NOT NULL,
  verse_reference TEXT NOT NULL,
  verse_text TEXT NOT NULL,
  custom_message TEXT,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  pickup_count INTEGER DEFAULT 0,
  is_moderated BOOLEAN DEFAULT false,
  moderation_status TEXT DEFAULT 'approved', -- approved | pending | rejected
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX drops_location_idx ON drops USING GIST(location);
CREATE INDEX drops_user_token_idx ON drops(user_token);

CREATE TABLE user_pickups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_token TEXT NOT NULL,
  drop_id UUID REFERENCES drops(id) ON DELETE CASCADE,
  picked_up_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_token, drop_id)
);

CREATE TABLE drop_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_token TEXT NOT NULL,
  drop_id UUID REFERENCES drops(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL, -- amen | heart | pray
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_token, drop_id, reaction_type)
);
