CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 
CREATE OR REPLACE FUNCTION "testInsertBeforeFunc"()
RETURNS TRIGGER AS $BODY$
DECLARE
  EXISTS VARCHAR(255); 
BEGIN
  UPDATE "User" SET "firstName"=new."firstName"
  WHERE "email"=new."email"
  RETURNING "email" INTO EXISTS;

  -- If the above was successful, it would return non-null
  -- in that case we return NULL so that the triggered INSERT
  -- does not proceed
  IF EXISTS IS NOT NULL THEN
    RETURN NULL;
  END IF;

  -- Otherwise, return the new record so that triggered INSERT
  -- goes ahead
  RETURN new;
END; 
$BODY$
LANGUAGE 'plpgsql' SECURITY DEFINER;
