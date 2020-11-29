DROP TABLE IF EXISTS "School";
DROP TABLE IF EXISTS "EventRegistration";
DROP TABLE IF EXISTS "TournamentEntrant";
DROP TABLE IF EXISTS "Announcement";
DROP TABLE IF EXISTS "Team";
DROP TABLE IF EXISTS "User";
DROP TABLE IF EXISTS "Tournament";
DROP TABLE IF EXISTS "Event";

DROP TYPE IF EXISTS "Role";

--create types
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role') THEN
        CREATE TYPE "Role" AS ENUM
        (
          'delegate',
          'sponsor',
          'scl',
          'volunteer',
          'convention',
          'administrator'
        );
    END IF;
    --more types here...
END$$;

CREATE TABLE IF NOT EXISTS public."School" (
  "id"  UUID  PRIMARY KEY NOT NULL,
  "name"  VARCHAR(255)  NOT NULL
);

CREATE TABLE IF NOT EXISTS public."User" (
  "id"          UUID          PRIMARY KEY NOT NULL,
  "email"       VARCHAR(255)  UNIQUE NOT NULL,
  "password"    VARCHAR(100)  NOT NULL,
  "phoneNumber" BIGINT        UNIQUE,
  "firstName"   VARCHAR(255)  NOT NULL,
  "lastName"    VARCHAR(255)  NOT NULL,
  "role"        "Role"        NOT NULL DEFAULT 'delegate',
  "school"      VARCHAR(255)  NOT NULL,
  "grade"       SMALLINT,
  "latinLevel"  VARCHAR(7)
);

CREATE TABLE IF NOT EXISTS public."Event" (
  "id"                UUID          PRIMARY KEY NOT NULL DEFAULT UUID_GENERATE_V4(),
  "name"              VARCHAR(255)  NOT NULL,
  "description"       TEXT,
  "startTime"         TIMESTAMP,
  "endTime"           TIMESTAMP,
  "location"          VARCHAR(255),
  "openRegistration"  BOOLEAN       NOT NULL DEFAULT FALSE,
  "published"         BOOLEAN       NOT NULL DEFAULT FALSE
);

-- Junction table for users signed up for events
CREATE TABLE IF NOT EXISTS public."EventRegistration" (
  "userId"    UUID    REFERENCES "User" ("id") ON UPDATE CASCADE ON DELETE CASCADE,
  "eventId"   UUID    REFERENCES "User" ("id") ON UPDATE CASCADE,
  "subscribe" BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT "userEventPkey" PRIMARY KEY ("userId", "eventId")
);

CREATE TABLE IF NOT EXISTS public."Tournament" (
  "id"      UUID          PRIMARY KEY NOT NULL DEFAULT UUID_GENERATE_V4(),
  "name"    VARCHAR(255)  NOT NULL,
  "eventId" UUID          UNIQUE REFERENCES "Event" ("id") ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS public."Team" (
  "id"    UUID          PRIMARY KEY NOT NULL DEFAULT UUID_GENERATE_V4(),
  "name"  VARCHAR(255)  UNIQUE NOT NULL
);

-- Junction table for users part of a team (or multiple teams)
CREATE TABLE IF NOT EXISTS public."TeamMembership" (
  "userId"  UUID  REFERENCES "User" ("id") ON UPDATE CASCADE ON DELETE CASCADE,
  "teamId"  UUID  REFERENCES "Team" ("id") ON UPDATE CASCADE,
  CONSTRAINT "userTeamPkey" PRIMARY KEY ("userId", "teamId")
);

CREATE TABLE IF NOT EXISTS public."TournamentEntrant" (
  "teamId"        UUID  REFERENCES "User" ("id") ON UPDATE CASCADE ON DELETE CASCADE,
  "tournamentId"  UUID  REFERENCES "Tournament" ("id") ON UPDATE CASCADE,
  CONSTRAINT "entrantPkey" PRIMARY KEY ("teamId", "tournamentId")
);

CREATE TABLE IF NOT EXISTS public."Announcement" (
  "id"          UUID          PRIMARY KEY NOT NULL DEFAULT UUID_GENERATE_V4(),
  "authorId"    UUID          REFERENCES "User" ("id"),
  "title"       VARCHAR(255)  NOT NULL,
  "body"        TEXT,
  "createdOn"   TIMESTAMP     NOT NULL DEFAULT NOW(),
  "published"   BOOLEAN       NOT NULL DEFAULT FALSE,
  "publishDate" TIMESTAMP
);
