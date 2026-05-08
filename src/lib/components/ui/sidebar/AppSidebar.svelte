<script lang="ts">
	import LayoutDashboardIcon from '@lucide/svelte/icons/layout-dashboard';
	import FolderKanbanIcon from '@lucide/svelte/icons/folder-kanban';
	import Building2Icon from '@lucide/svelte/icons/building-2';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { SidebarItem, SidebarProps } from '$lib/components/ui/sidebar/types';

	const defaultItems: SidebarItem[] = [
		{
			title: 'Dashboard',
			url: '/',
			icon: LayoutDashboardIcon
		},
		{
			title: 'Organizações',
			url: '/organizations',
			icon: Building2Icon
		},
		{
			title: 'Projetos',
			url: '#',
			icon: FolderKanbanIcon
		},
		
	];

	let { groupLabel = 'Arthemis', items = defaultItems }: SidebarProps = $props();
</script>

<Sidebar.Root>
	<Sidebar.Header class="sidebar-header">
		<div class="sidebar-header-row">
			<Sidebar.GroupLabel class="sidebar-group-label">{groupLabel}</Sidebar.GroupLabel>
			<Sidebar.Trigger class="sidebar-trigger" />
		</div>
	</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each items as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href={item.url} {...props}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
</Sidebar.Root>

<style>
	.sidebar-header {
		padding-bottom: 0.25rem;
	}

	.sidebar-header-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		width: 100%;
	}

	:global(.sidebar-group-label) {
		margin-right: auto;
		padding-left: 0.25rem;
	}

	:global(.sidebar-trigger) {
		margin-left: auto;
		flex-shrink: 0;
	}
</style>
