import { NextSeo } from 'next-seo';
import { sortDate } from '@pantheon-systems/nextjs-kit';
import { isMultiLanguage } from '../lib/isMultiLanguage';
import { getCurrentLocaleStore, globalDrupalStateStores } from '../lib/stores';

import { ArticleGrid } from '../components/grid';
import Image from 'next/image';
import Layout from '../components/layout';

export default function HomepageTemplate({
	sortedArticles,
	footerMenu,
	hrefLang,
	multiLanguage,
}) {
	const HomepageHeader = () => (
		<div id="header" className="flex flex-col mx-auto justify-center">
			<h1 className="prose text-4xl text-center">
				Welcome to{' '}
				<a
					className="font-bold no-underline hover:underline"
					href="https://nextjs.org"
				>
					Next.js!
				</a>
			</h1>
			<div className="text-2xl">
				<div className="text-black rounded flex items-center justify-center p-4">
					Built with Decoupled Drupal on Pantheon.io{' '}
				</div>
			</div>
		</div>
	);

	return (
		<Layout footerMenu={footerMenu}>
			<NextSeo
				title="Decoupled Next Drupal Demo"
				description="Generated by create-pantheon-decoupled-kit."
				languageAlternates={hrefLang || false}
			/>
			<>
				<HomepageHeader />
				<section>
					<ArticleGrid
						data={sortedArticles}
						contentType="articles"
						multiLanguage={multiLanguage}
					/>
				</section>
			</>
		</Layout>
	);
}

export async function getServerSideProps(context) {
	const origin = process.env.NEXT_PUBLIC_FRONTEND_URL;
	const { locales } = context;
	// if there is more than one language in context.locales,
	// assume multilanguage is enabled.
	const multiLanguage = isMultiLanguage(locales);
	const hrefLang = locales.map((locale) => {
		return {
			hrefLang: locale,
			href: origin + '/' + locale,
		};
	});

	try {
		const store = getCurrentLocaleStore(
			context.locale,
			globalDrupalStateStores,
		);

		const articles = await store.getObject({
			objectName: 'node--article',
			params: 'include=field_media_image.field_media_image',
			refresh: true,
			res: context.res,
			anon: true,
		});

		if (!articles) {
			throw new Error(
				'No articles returned. Make sure the objectName and params are valid!',
			);
		}

		const sortedArticles = sortDate({
			data: articles,
			key: 'changed',
			direction: 'desc',
		});

		const footerMenu = await store.getObject({
			objectName: 'menu_items--main',
			refresh: true,
			res: context.res,
			anon: true,
		});

		return {
			props: { sortedArticles, hrefLang, multiLanguage, footerMenu },
		};
	} catch (error) {
		console.error('Unable to fetch data for articles page: ', error);
		return {
			notFound: true,
		};
	}
}
