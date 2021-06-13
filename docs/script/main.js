//import Vizzu from 'https://storage.googleapis.com/vizzu-lib-main/lib/vizzu.js';
//import Vizzu from 'https://vizzuhq.github.io/vizzu-beta-release/0.1.0/vizzu.js'
import Vizzu from '../../example/lib/vizzu.js'
import data from './sample-data.js';
import style from './example-style.js';
import documentation from './documentation.js';

function formatSnippet(snippet)
{
	return snippet
		.replace(/chart =>/, '')
		.replace(/\t/g, '  ')
		.replace(/^    /mg,' ');
}

function sectionById(id) {
	return documentation.find(section => section.id == id);
}

class Main
{
	constructor()
	{
		this.chart = new Vizzu(document.getElementById('example-canvas'));
		this.toc = document.getElementById('table-of-contents');
		this.content = document.getElementById('content');

		this.lastSection = null;
		this.nextSection = null;

		this.initializeChart();
		this.populate();

		this.contentView = document.getElementById('content-view');
		this.contentView.focus();
		this.contentView.onscroll = event => this.scrolled(event);
	}

	initializeChart()
	{
		this.anim = this.chart.initializing.then(chart =>
			chart.animate({
				data: data,
				style: style,
				descriptor: {
					channels: {
						x: { attach: ['Timeseries'] },
						y: { attach: ['Values 1']},
						size: { attach: ['Values 1']},
					},
					title: null
				}
			})
		);
	}

	populate()
	{
		for (let section of documentation)
		{
			this.addTocItem(section);
			this.addSection(section);
		}
	}

	addTocItem(section)
	{
		let tocItem = document.createElement('li');
		tocItem.innerHTML = section.title.toUpperCase();
		tocItem.id = section.id + '-menuitem';
		tocItem.classList.add('toc-item');
		tocItem.onclick = () => {
			this.scrollTo(section);
		};
		this.toc.appendChild(tocItem);
	}

	addSection(section)
	{
		const snippet = formatSnippet(section.enter.toString());

		this.content.innerHTML += `
		<h2 id="${section.id + '-title'}">${section.title}</h2>
		<div class="snippet" id="${section.id + '-snippet'}">
			<pre><code class="JavaScript">${snippet}</code></pre>
		</div>
		<div>${section.description}</div>
		<div id="${section.id + '-end'}" class="section-end"></div>
		`;
	}

	scrolled(event)
	{
		const topSection = this.firstVisibleSnippet();
		if (topSection != this.lastSection) {
			this.nextSection = topSection;
			setTimeout(() => this.activate(), 500);
		}
	}

	scrollTo(section)
	{
		let sectionTitle = document.getElementById(section.id + '-title')
		sectionTitle.scrollIntoView();
	}

	activate()
	{
		if (this.nextSection == null) return;

		const section = this.nextSection;
		this.nextSection = null;

		if (this.lastSection !== null)
		{
			this.anim = this.anim.then(this.lastSection.leave);
			let menuItem = document.getElementById(this.lastSection.id + '-menuitem')
			menuItem.classList.remove('toc-item-selected');
			this.lastSection = null;
		}

		this.anim = this.anim.then(section.enter);

		let menuItem = document.getElementById(section.id + '-menuitem')
		menuItem.classList.add('toc-item-selected');

		this.lastSection = section;
	}

	firstVisibleSnippet()
	{
		const snippets = this.content.getElementsByClassName('snippet');
		let prevId = '';
		for (const snippet of snippets)
		{
			if (this.isBelowExampleView(snippet, this.contentView))
			{
				console.log(snippet.getBoundingClientRect().top,
					this.contentView.getBoundingClientRect().top);
				return sectionById(prevId);
			}
			prevId = snippet.id.replace(/-snippet/, '');
		}
		return sectionById(prevId);
	}

	isBelowExampleView(snippet) {
		const snippetRect = snippet.getBoundingClientRect();
		const viewRect = this.contentView.getBoundingClientRect();
		return snippetRect.top > viewRect.top + 25;
	}
}

window.main = new Main();