<script lang="ts">
  import { page } from '$app/stores';

  // Cada item de navegação tem label, rota e um ícone em SVG
  interface NavItem {
    label: string;
    href: string;
    icon: 'dashboard' | 'projects';
  }

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/',           icon: 'dashboard' },
    { label: 'Projects',  href: '/projects',   icon: 'projects'  },
  ];
</script>

<aside class="sidebar">
  <nav>
    {#each navItems as item}
      <!-- $page.url.pathname compara a rota atual para marcar como ativo -->
      <a
        href={item.href}
        class="nav-item"
        class:active={$page.url.pathname === item.href}
      >
        <!-- Ícones inline em SVG — sem dependência de lib de ícones -->
        {#if item.icon === 'dashboard'}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
        {:else}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 3h7v18H3zM14 3h7v11h-7zM14 17h7v4h-7z"/>
          </svg>
        {/if}

        <span>{item.label}</span>
      </a>
    {/each}
  </nav>
</aside>

<style>
  .sidebar {
    width: 140px;
    min-height: 100vh;
    background: #1e2d1e;
    padding: 1.5rem 0;
    flex-shrink: 0;
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 0 12px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    color: #8aaa8a;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: background 0.15s, color 0.15s;
  }

  .nav-item:hover {
    background: #2a3d2a;
    color: #c8e6c8;
  }

  /* class:active aplica essa classe quando a prop for true */
  .nav-item.active {
    background: #2a3d2a;
    color: #ffffff;
  }
</style>
