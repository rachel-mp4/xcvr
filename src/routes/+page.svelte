<script lang="ts">
	let onevis = $state(false);
	let one = $state(false);
	let twovis = $state(false);
	let two = $state(false);
	let threevis = $state(false);
	let three = $state(false);
	let fourvis = $state(false);
	let four = $state(false);
	let fivevis = $state(false);
	let five = $state(false);
	let sixvis = $state(false);
	let six = $state(false);
	let sevenvis = $state(false);
	let seven = $state(false);
	let eightvis = $state(false);
	let eight = $state(false);
	let ninevis = $state(false);
	let nine = $state(false);
	let tenvis = $state(false);
	let ten = $state(false);
	let elevenvis = $state(false);
	let eleven = $state(false);
	$effect(() => {
		if (!onevis) {
			one = false;
		}
	});
	$effect(() => {
		if (!twovis) {
			two = false;
		}
	});
	$effect(() => {
		if (!threevis) {
			three = false;
		}
	});
	$effect(() => {
		if (!fourvis) {
			four = false;
		}
	});
	$effect(() => {
		if (!fivevis) {
			five = false;
		}
	});
	$effect(() => {
		if (one) {
			sixvis = true;
		} else {
			sixvis = false;
		}
	});
	$effect(() => {
		if (!sixvis) {
			six = false;
		}
	});
	$effect(() => {
		if (two || nine) {
			sevenvis = true;
		} else {
			sevenvis = false;
			seven = false;
		}
	});
	$effect(() => {
		if (!sevenvis) {
			seven = false;
		}
	});

	$effect(() => {
		if (three) {
			eightvis = true;
		} else {
			eightvis = false;
		}
	});
	$effect(() => {
		if (!eightvis) {
			eight = false;
		}
	});
	$effect(() => {
		if (three) {
			ninevis = true;
		} else {
			ninevis = false;
		}
	});
	$effect(()=> {
		if (!ninevis) {
			nine = false;
		}
	})
	$effect(() => {
		if (four || eight || nine) {
			tenvis = true;
		} else {
			tenvis = false;
		}
	});
	$effect(() => {
		if (!tenvis) {
			ten = false;
		}
	});
	$effect(() => {
		if (five) {
			elevenvis = true;
		} else {
			elevenvis = false;
		}
	});
	$effect(()=> {
		if (!elevenvis) {
			eleven = false;
		}
	})
</script>

<svelte:head>
	<title>xcvr</title>
</svelte:head>
<main class="fp-blurb">
	<h1>welcome to <span class="zizz">xcvr</span></h1>
	<h2>
		hyper-real-time<span class="footnote">1</span> communication<span
			class="footnote">2</span
		>
		on atproto<span class="footnote">3</span> with lrc<span class="footnote"
			>4</span
		>
	</h2>
	<p>
		hi! i'm rachel and i'd like to welcome you to xcvr (pronounced transceiver)!
	</p>
	<p>
		tune in to a channel (to the left) and start chatting, make your own, or login
		with atproto if you'd like (it's optional, but recommended)
	</p>
	<p style="border-bottom: .25rem solid white">
		don't be weird, don't be mean, you're on our computer screens<span
			class="footnote">5</span
		>
	</p>
	<button
		onclick={() => {
			onevis = !onevis;
			twovis = !twovis;
			threevis = !threevis;
			fourvis = !fourvis;
			fivevis = !fivevis;
		}}
	>
		{onevis ? "close" : "open"} footnotes
	</button>
	{#if onevis}
		<button
			onclick={() => {
				one = !one;
			}}
		>
			{one ? "close" : "open"} footnote 1
		</button>
	{/if}
	{#if one}
		<p style="margin-top: 0">
			<span class="footnote">1</span>like telephone x email, or g**gle docs x
			d*scord. where real-time messaging sends your message instantly when it's
			done, hyper-real-time is always-already transmitting and recieving.<span
				class="footnote">6</span
			>
		</p>
	{/if}
	{#if twovis}
		<button
			onclick={() => {
				two = !two;
			}}
		>
			{two ? "close" : "open"} footnote 2
		</button>
	{/if}
	{#if two}
		<p style="margin-top:0">
			<span class="footnote">2</span>text-based communication, for now... i'm
			only one dev<span class="footnote">7</span>
		</p>
	{/if}
	{#if threevis}
		<button
			onclick={() => {
				three = !three;
			}}
		>
			{three ? "close" : "open"} footnote 3
		</button>
	{/if}
	{#if three}
		<p style="margin-top:0">
			<span class="footnote">3</span>atproto is the protocol that bluesky runs
			on, and which xcvr uses for identity<span class="footnote">8</span> and other
			things<span class="footnote">9</span>
		</p>
	{/if}
	{#if fourvis}
		<button
			onclick={() => {
				four = !four;
			}}
		>
			{four ? "close" : "open"} footnote 4
		</button>
	{/if}
	{#if four}
		<p style="margin-top:0">
			<span class="footnote">4</span>lrc is a protocol that i made for
			hyper-real-time communication, based on internet relay chat. it's entirely
			open, but unfortunately due to limitations in atproto, hrt is incompatible
			with atproto for now. i guess you could say it's trans<span
				class="footnote">ceiver</span
			>phobic<span class="footnote">10</span>
		</p>
	{/if}
	{#if fivevis}
		<button
			onclick={() => {
				five = !five;
			}}
		>
			{five ? "close" : "open"} footnote 5
		</button>
	{/if}
	{#if five}
		<p style="margin-top:0">
			<span class="footnote">5</span><a
				class="normal"
				href="https://blackdresses.bandcamp.com/track/please-be-nice"
				>it's our world, it's our lives, we are people please be nice</a
			><span class="footnote">11</span>
		</p>
	{/if}
	{#if sixvis}
		<button
			onclick={() => {
				six = !six;
			}}
		>
			{six ? "close" : "open"} footnote 6
		</button>
	{/if}
	{#if six}
		<p style="margin-top:0">
			<span class="footnote">6</span>transmitting and receiving...
			transceiving... xcvr... ok it's a silly name but at least there's a god
			damn reason for the x in the name unlike * the everything app.
		</p>
	{/if}
	{#if sevenvis}
		<button
			onclick={() => {
				seven = !seven;
			}}
		>
			{seven ? "close" : "open"} footnote 7
		</button>
	{/if}
	{#if seven}
		<p style="margin-top:0">
			<span class="footnote">7</span>for now... everything is open source and if
			you're at all interested in contributing, email me @ rachel@moth11.net or
			my twitter is
			<a class="normal" href="https://bsky.app/profile/moth11.net"
				>@moth11.net</a
			>
			even if you have no skills there's always stuff to do!
		</p>
	{/if}
	{#if eightvis}
		<button
			onclick={() => {
				eight = !eight;
			}}
		>
			{eight ? "close" : "open"} footnote 8
		</button>
	{/if}
	{#if eight}
		<p style="margin-top:0">
			<span class="footnote">8</span>so personally, i think there's a lot of
			actually radically positive power in anonymity, it's quite unnatural to
			meet someone in the extended realm and know that they have the capacity to
			know everything about you. that's quite weird, isn't it? so at least until
			we hit the growing pains, you're gonna able to use everything here without
			an account. and even if you do have an atproto identity, i'm not going to
			add affordances to make the decentralized panopticon super present. if
			you're interested in the technical side of how atproto fits into this, see
			<span class="footnote">10</span>
		</p>
	{/if}
	{#if ninevis}
		<button
			onclick={() => {
				nine = !nine;
			}}
		>
			{nine ? "close" : "open"} footnote 9
		</button>
	{/if}
	{#if nine}
		<p style="margin-top:0">
			<span class="footnote">9</span>chat history, images when i (or we)<span
				class="footnote">7</span
			>
			get around to them, and there's what i find to be a cute lil approach to appviews
			as their own atproto repositories, which could allow for gossip approaches
			to the centralization issue<span class="footnote">10</span> here.
		</p>
	{/if}
	{#if tenvis}
		<button
			onclick={() => {
				ten = !ten;
			}}
		>
			{ten ? "close" : "open"} footnote 10
		</button>
	{/if}
	{#if ten}
		<p style="margin-top:0">
			<span class="footnote">10</span>so how does all of this crap work?
		</p>
		<p style="margin-top:0">
			hyper-real-time communication just works by telling a server "i typed e at
			position 0", which it then relays to all other people in the channel. we
			want this to be fast, it's gotta be hyper-real-time. and also, this uses a
			bit of extra bandwidth per message compared to real-time. So though it's
			technically feasible to have the server be your atproto pds, and the relay
			be the atproto firehose, all of that adds a bunch of latency which would
			basically make it kinda suck to use, and if xcvr ever scales, it also adds
			a ton of overhead which would be pretty wasteful for the rest of
			atprotocol. so instead, the server that you communicate with is the
			appview that you're connecting to, probably xcvr for now but i'd love for
			there to be more in the future, and the relay is an lrc server. all of
			this is open source, but whoever controls the appview can interfere with
			anything which is relayed. (mostly, this just looks like banning people,
			which i'm not happy to do,<span class="footnote">11</span>but it could
			also lie about who said what, and what was even said). to minimize the
			power that the server has, while also preventing bad actors from causing
			confusion, identity works through the following dance. at the beginning of
			lrc message composition, a user declares their name and atproto identity,
			if they please. they might be lying. then the appview issues a signet that
			says "i saw alice.com start post #111". then when you're done with your
			message, you issue a message record to your repository that says "i'm
			alice.com and in message #111 i said sneep snirp". then, if the signet
			matches the message record, everyone can be sure that post #111 did belong
			to alice.com, and she wants it to be known that they said "sneep snirp".
			as people are composing their messages, you'll be able to see the likely
			identities which they that the person composing the message is claiming to
			be, but until the dance concludes, you can't be sure
		</p>
		<p style="margin-top:0rem">
			but because signets are just records in the host appview's repository,
			users can also issue their own signets, (and even in the future possibly
			"account" records, your account of what someone else said) and if enough
			people do this, and there's a good enough consensus algorithm, it could be
			harder for appviews to tamper with communication
		</p>
		<p style="margin-top:0rem">
			this is way too long, but why not a lil bit more! of course, since this is
			on atproto in 2025, everything is currently public information! above, i
			said "host" appview. when you make a channel, you need to declare a host,
			and then if the host will platform you, it will instantiate an lrc relay
			at the appropriate address (appviews implement the resolveChannel
			lexicon). if everything goes right, suppose you have your competing
			appview at "transceiver.gov.co.uk". if your appview federates with xcvr
			and vice versa, every channel hosted on xcvr will be accessible from
			transceiver.gov.co.uk, and vice versa. even though the channels take place
			off atproto, it should still be a seemless ux if everything goes to plan
		</p>
	{/if}
	{#if elevenvis}
		<button
			onclick={() => {
				eleven = !eleven;
			}}
		>
			{eleven ? "close" : "open"} footnote 11
		</button>
	{/if}
	{#if eleven}
		<p style="margin-top:0">
			<span class="footnote">11</span>i'm really not interested in making rules
			and moderating and all that. i will of course if necessary, i just don't
			believe anyone doesn't know that they are breaking the rules when they 
			are breaking the rules. another town square with so many rules where useless 
			libido gets metabolized into debates to nowhere? zzzzz zzzz zzzz zzzzz
			ZZZZZZZZZZZ! we have enough of those and look where they got us. instead,
			i'd instead like to imagine this is, instead, a public park instead, where
			instead you might happily run into an old friend, or even instead make a
			new one instead. what new possibilities could that open up?
		</p>
		<p>or</p>
		<p>
			<a
				class="normal"
				href="https://www.marxists.org/archive/marx/works/1845/theses/index.htm"
				>(social media platforms have hitherto only reflected the world in
				various ways; the point is to change it.)</a
			>
		</p>
	{/if}
</main>
<aside>
	<a href="/settings"> adjust settings </a>
</aside>

<style>
	button {
		display: block;
		font-size: 1rem;
		color: white;
		border: none;
		background: none;
		font-weight: 700;
		cursor: pointer;
		margin-top: 1rem;
		padding: 0;
	}
	h1 {
		position: relative;
		font-size: 4rem;
		font-weight: normal;
		display: inline-block;
	}
	h2 {
		margin-block: 0 1rem;
	}
	.normal {
		display: inline;
		font-size: 1rem;
	}
	h1 .zizz {
		color: transparent;
		text-shadow:
			0rem 0rem black,
			-0.25rem -0.25rem #e18f39,
			-0.5rem -0.5rem #c5c042,
			-0.75rem -0.75rem #387f4d,
			-1rem -1rem #1d4633;
		transition: 0.17s all;
	}
	.footnote {
		font-size: 0.5em;
		display: inline-block;
		position: relative;
		bottom: 0.5em;
	}
	h1 .zizz:hover {
		color: white;
		text-shadow:
			0rem 0rem #00000000,
			0rem 0rem #e18f3900,
			0rem 0rem #c5c04200,
			0rem 0rem #387f4d00,
			0rem 0rem #1d463300;
	}
	p:not(:first-of-type) {
		margin-top: 1rem;
	}
	/* h1::before {
		content: "";
		position: absolute;
		z-index: -1;
		left: 0rem;
		right: 0rem;
		top: 3rem;
		bottom: 0.375rem;
		background-image: linear-gradient(
			90deg,
			#034732ff,
			#034732ee 40%,
			#008148dd 40%,
			#008148cc 70%,
			#c6c013bb 70%,
			#c6c013aa 90%,
			#ef8a1799 90%,
			#ef8a1788
		);
	} */
</style>
