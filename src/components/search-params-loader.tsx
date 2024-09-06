"use client";
// modified from https://github.com/vercel/next.js/discussions/61654#discussioncomment-10178402
// context https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout

// nextjs requires that we wrap anything that needs the useSearchParams hook in
// Suspense. since I only need the params for things that occur after the load
// is finished (e.g. form submission) and I don't want to block the UI w/
// suspense, this is a good, childless way of hoisting the params back up to the
// parent component that needs them in a non-UI blocking way
// https://github.com/vercel/next.js/discussions/61654

import { type ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";

type SearchParamsLoaderProps = {
	onParamsReceived: (params: ReadonlyURLSearchParams) => void;
};

function Suspender(props: SearchParamsLoaderProps) {
	return (
		<Suspense>
			<Suspendend {...props} />
		</Suspense>
	);
}

function Suspendend({ onParamsReceived }: SearchParamsLoaderProps) {
	const searchParams = useSearchParams();

	useEffect(() => {
		onParamsReceived(searchParams);
	});

	return null;
}

const SearchParamsLoader = React.memo(Suspender);

export default SearchParamsLoader;

// Hook

export const useSearchParamsLoader = () => {
	const [searchParams, setSearchParams] =
		React.useState<ReadonlyURLSearchParams | null>(null);

	return { searchParams, setSearchParams };
};
