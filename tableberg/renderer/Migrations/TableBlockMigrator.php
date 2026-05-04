<?php

namespace Tableberg\Renderer\Migrations;

class TableBlockMigrator {
    const CURRENT_VERSION = 2;

    public function migrate($attrs, $block = null) {
        if (!is_array($attrs)) {
            return $attrs;
        }

        $version = $this->get_version($attrs);
        if ($version >= self::CURRENT_VERSION) {
            return $attrs;
        }

        $migrators = $this->get_migrators();

        while ($version < self::CURRENT_VERSION) {
            if (!isset($migrators[$version])) {
                return $attrs;
            }

            $attrs = $migrators[$version]->migrate($attrs, $block);
            if (!is_array($attrs)) {
                return $attrs;
            }

            $version = $this->get_version($attrs);
        }

        return $attrs;
    }

    private function get_version($attrs) {
        if (
            !is_array($attrs) ||
            !isset($attrs['version']) ||
            !is_numeric($attrs['version'])
        ) {
            return 0;
        }

        return (int) $attrs['version'];
    }

    private function get_migrators() {
        return [
            0 => new TableBlockMigratorV0ToV1(),
            1 => new TableBlockMigratorV1ToV2(),
        ];
    }
}
