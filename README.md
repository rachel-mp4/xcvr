hi! welcome to xcvr-frontend!

evidently this is a frontend for the xcvr appview, built with sveltekit. the
backend is xcvr-backend, also known as rvcx.

to run this, i believe you do npm install and npm run dev. i think you need to
create a file titled `.env` in this top level directory with text
`VITE_API_URL=http://localhost:8080` in development, or
`VITE_API_URL=https://YOUR.DOMAIN` in production, i believe

in production, i use the b script (with sudo) to build and serve, this will
probably change bc it takes way too long and i don't wanna sit around doing
nothing for 15 seconds but if you're using the nginx config provided in rvcx,
that will deploy the built server to the appropriate place more or less.

if you'd like to contribute, i'd appreciate any help with respect to anything,
but maybe let me know in advance, both cause i probably am leaving out 99999%
of the information about how these programs actually work, and because as you
can see my commit history is not the cleanest. git is a bit mysterious to me
and i mostly have been testing in production since i didn't think learning how
to set up local oauth testing was worth it a few months ago, but i can be much
cleaner if others are interested in contributing.

as for licenses, i think this is probably under mit, but i don't know all too
much about that crap.
