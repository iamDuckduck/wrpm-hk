# Rich-text description migration

This migration copies existing localized plain text into the additive rich-text fields. It never unsets legacy fields. `setIfMissing` and the converter's existing-field checks make repeated runs safe and prevent overwriting content already edited in Studio. Draft and published documents retain their existing IDs and publication state.

## Dry run

From `apps/studio`, run:

```powershell
.\node_modules\.bin\sanity.cmd migrations run rich-text-descriptions --dry-run
```

The default is also dry-run mode. Review the CLI's processed, migrated, skipped, and failed counts and spot-check the generated mutations. This reads the configured dataset but does not write it.

## Authorized rollout

1. Export or otherwise back up the target dataset.
2. Deploy the additive schema and fallback-capable frontend.
3. Run and review the dry run against the exact target project and dataset.
4. Only with explicit authorization, execute with `--no-dry-run` and the explicit project/dataset flags.
5. Rebuild the frontend and compare Chinese, English, and Japanese pages with the legacy source text.
6. Keep legacy fields through the observation period. Roll back the frontend by reverting to legacy reads; the migration does not remove or alter that data.

If a run reports failures, stop and retain the legacy fallback. Do not delete the legacy fields until all documents and drafts have been verified separately.
